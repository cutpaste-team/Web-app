import io, traceback

from flask import Flask, request, g
from flask import send_file,make_response,send_from_directory
from flask_mako import MakoTemplates, render_template
from plim import preprocessor

from PIL import Image
import numpy as np
import cv2

from skimage import transform
import torch
import torchvision
from torch.autograd import Variable
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms#, utils
# import torch.optim as optim

from data_loader import RescaleT
from data_loader import ToTensor
from data_loader import ToTensorLab
from data_loader import SalObjDataset

from model import U2NET # full size version 173.6 MB
from model import U2NETP # small version u2net 4.7 MB
from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os 
import json
import cloudinary
import cloudinary.uploader

# normalize the predicted SOD probability map
def normPRED(d):
    ma = torch.max(d)
    mi = torch.min(d)

    dn = (d-mi)/(ma-mi)

    return dn

def preprocess_img(image):
    label_3 = np.zeros(image.shape)
    label = np.zeros(label_3.shape[0:2])

    if (3 == len(label_3.shape)):
        label = label_3[:, :, 0]
    elif (2 == len(label_3.shape)):
        label = label_3

    if (3 == len(image.shape) and 2 == len(label.shape)):
        label = label[:, :, np.newaxis]
    elif (2 == len(image.shape) and 2 == len(label.shape)):
        image = image[:, :, np.newaxis]
        label = label[:, :, np.newaxis]

    transform = transforms.Compose([RescaleT(320), ToTensorLab(flag=0)])
    sample = transform({'imidx': np.array([0.]),'image': image, 'label': label})

    return sample

def run(img):
    torch.cuda.empty_cache()
    img_BGRA = None
    with torch.no_grad():
      sample = preprocess_img(img)
      inputs_test = sample['image'].unsqueeze(0)
      inputs_test = inputs_test.type(torch.FloatTensor)

      if torch.cuda.is_available():
          inputs_test = Variable(inputs_test.cuda())
      else:
          inputs_test = Variable(inputs_test)

      d1,d2,d3,d4,d5,d6,d7= net(inputs_test)

      # normalization
      pred = d1[:,0,:,:]
      pred = normPRED(pred)

      predict = pred
      predict = predict.squeeze()
      predict_np = predict.cpu().data.numpy()

      im = Image.fromarray(predict_np*255).convert('RGB')
      imo = np.array(im.resize((img.shape[1],img.shape[0]),resample=Image.BILINEAR))

      del d1,d2,d3,d4,d5,d6,d7
      mask = imo.mean(axis=2)
      bmask = (mask >= 200)
      rows_with_white = np.max(bmask, axis=1)
      cols_with_white = np.max(bmask, axis=0)
      row_low = np.argmax(rows_with_white)
      row_high = len(rows_with_white) -np.argmax(rows_with_white[::-1])
      col_low = np.argmax(cols_with_white)
      col_high = len(cols_with_white) -np.argmax(cols_with_white[::-1])

      im_cropped = Image.fromarray(img[row_low:row_high, col_low:col_high])
      m = Image.fromarray(imo[row_low:row_high, col_low:col_high]).convert("L")
      empty = Image.new("RGBA",im_cropped.size, 0)

      removed_background = Image.composite(im_cropped, empty, m)
      removed_background

    return removed_background

app = Flask(__name__, instance_relative_config=True)

# For Plim templates
# Allow 
CORS(app)

# Path for uploaded images

UPLOAD_FOLDER = 'uploads/upload_images/' #localhost:3000
CUT_FOLDER = 'uploads/cut_images/' #localhost:3000
CUT_FILE = None

cloudinary.config(
    cloud_name='dq9zo1j7z',
    api_key= '962568116471166',
    api_secret= 'eDv59CoBF6GnbUCW2YhzZ27ABBw'
)

# Allowed file extransions
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config.from_object('config.ProductionConfig')

BACKGROUND = []
BACKGROUND_FOLDER = "uploads/background/"
PROCESS_FOLDER = "uploads/process_images/"

print("Loading model")
model_name='u2netp'#u2netp
model_dir = './saved_models/'+ model_name + '/' + model_name + '.pth'

if(model_name=='u2net'):
    print("...load U2NET---173.6 MB")
    net = U2NET(3,1)
elif(model_name=='u2netp'):
    print("...load U2NEP---4.7 MB")
    net = U2NETP(3,1)
net.load_state_dict(torch.load(model_dir,map_location=lambda storage, loc: storage))
if torch.cuda.is_available():
    net.cuda()
net.eval()

def predict(img_path):
    # Load image
    print("PREDICTING")
    image = np.array(Image.open(img_path))
    img_BGRA = run(image)

    return img_BGRA

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def homepage():
    return ("hello world")


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    success = "Fail to upload"
    if request.method == 'POST':
        print("request data", request.data)
        print("request files", request.files)
        # check if the post request has the file part
        if 'file' not in request.files:
            return False
        file = request.files['file']

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)

            print("SAVING FILE",UPLOAD_FOLDER, filename)
            img_path = UPLOAD_FOLDER+filename
            file.save(img_path)
            img_BGRA = predict(img_path)

            filename = "".join(filename.split("."))

            global CUT_FILE 
            img_BGRA.save(CUT_FOLDER+filename+".PNG")
            CUT_FILE = filename
            success = "success"
    return success

@app.route('/get-cut-image',methods=["GET"])
def get_cut_img():
    if CUT_FILE:
        #return json.dumps(CUT_FILE)
        file_dict = cloudinary.uploader.upload(CUT_FOLDER+CUT_FILE+".PNG")
        print(CUT_FILE)

        return file_dict["secure_url"]
    else:
        return "Cannot cut the image"

@app.route('/merge',methods=["GET","POST"])
def find_bg():
    data = request.get_json()
    query = data["data"]
    global BACKGROUND
    if query != "": 
        BACKGROUND.append(query.split("/")[-1].split(".")[0]+".png")
    else:
        BACKGROUND.append("")
    return "success"

@app.route('/download', methods=["GET"]) 
def download():
    last_bg = BACKGROUND[-1]

    filename = CUT_FILE
    file_dict = {}
    if last_bg != 0:
        bg = Image.open(os.path.join(BACKGROUND_FOLDER,last_bg))
        obj = Image.open(CUT_FOLDER+filename+".PNG")
        bg.paste(obj, (700,300),mask=obj)
        save_path = PROCESS_FOLDER+filename+".png"
        bg.save(save_path)
        file_dict = cloudinary.uploader.upload(save_path)
    else:
        save_path = CUT_FOLDER+filename+".PNG"
        file_dict = cloudinary.uploader.upload(save_path)
    return file_dict["secure_url"]
if __name__ == '__main__':
    app.run(host='0.0.0.0')

