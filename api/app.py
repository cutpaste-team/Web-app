import io, traceback

from flask import Flask, request, g
from flask import send_file,make_response,send_from_directory
from processing import run, preprocess_img, predict

from PIL import Image
import numpy as np
import cv2
import torch
import torchvision

from model import U2NET # full size version 173.6 MB
from model import U2NETP # small version u2net 4.7 MB
from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os 
import json
import cloudinary
import cloudinary.uploader


app = Flask(__name__, instance_relative_config=True)
app.config.from_object('config.ProductionConfig')

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

PROCESS_CONFIG = {}
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
            img_BGRA = predict(net, img_path)

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
    query = data["url"]
    global PROCESS_CONFIG
    PROCESS_CONFIG["url"] = data["url"].split("/")[-1].split(".")[0]+".png"
    PROCESS_CONFIG["sizeImage"] = data["sizeImage"]
    PROCESS_CONFIG["axisX"] = data["axisX"]
    PROCESS_CONFIG["axisY"] = data["axisY"]
    print("PROCESS_CONFIG",PROCESS_CONFIG)
    return "success"


@app.route('/download', methods=["GET"]) 
def download():
    last_query = PROCESS_CONFIG
    filename = CUT_FILE
    file_dict = {}

    axisX = last_query["axisX"]
    axisY = last_query["axisY"]
    factor = last_query["sizeImage"] / 100
    obj = Image.open(CUT_FOLDER+filename+".PNG")
    obj = obj.resize((int(obj.size[0]*factor),int(obj.size[1]*factor)),resample=Image.BILINEAR)
    if last_query["url"] != "":
        bg = Image.open(os.path.join(BACKGROUND_FOLDER,last_query["url"]))
        bg.paste(obj, (axisX,axisY),mask=obj)

        save_path = PROCESS_FOLDER+filename+".png"
        bg.save(save_path)
        file_dict = cloudinary.uploader.upload(save_path)
    else:
        save_path = CUT_FOLDER+filename+".PNG"
        file_dict = cloudinary.uploader.upload(save_path)
    
    return file_dict["secure_url"]
    
    #return "success"

if __name__ == '__main__':
    app.run(host='0.0.0.0')
