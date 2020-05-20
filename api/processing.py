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
import numpy as np
from PIL import Image
import cv2

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

def run(net, img):
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

def predict(net, img_path):
    # Load image
    print("PREDICTING")
    image = np.array(Image.open(img_path))
    img_BGRA = run(net, image)
    print("FINISH PREDICTING")
    return img_BGRA
