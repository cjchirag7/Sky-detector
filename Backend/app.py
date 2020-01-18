from __future__ import print_function, division
from flask import Flask, jsonify, session, render_template, logging, request
# from data import Articles
from flask_mysqldb import MySQL
from flask_cors import CORS
from wtforms import Form, StringField, FloatField, PasswordField, validators
from passlib.hash import sha256_crypt
from functools import wraps
from cerberus import Validator
import json
import werkzeug
import os
import cv2

import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim import lr_scheduler
import numpy as np
import torchvision
from torchvision import datasets, models, transforms, utils
import matplotlib.pyplot as plt
import time
import copy
from sklearn.model_selection import KFold
import segmentation_models_pytorch as smp


import pandas as pd
from PIL import Image
import warnings
from torch.optim.lr_scheduler import ReduceLROnPlateau
from sklearn.model_selection import train_test_split
from torch.nn import functional as F
from torch.utils.data import DataLoader, Dataset, sampler
from albumentations import (HorizontalFlip, VerticalFlip, ShiftScaleRotate, Normalize,
                            Resize, Compose, GaussNoise, RandomRotate90, Transpose, RandomBrightnessContrast)

from albumentations.pytorch import ToTensor
import albumentations as albu
import matplotlib.image as mpi

app = Flask(__name__, static_folder="public", template_folder="templates")
CORS(app)
app.secret_key = 'secret123'

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'ttbmp123'
app.config['MYSQL_DB'] = 'sky_detector'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

UPLOAD_FOLDER = './public'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# init MYSQL
mysql = MySQL(app)
model = smp.Unet('resnet18', classes=1, activation=None, encoder_weights=None)
weight = torch.load('skyres182.pth', map_location='cpu')
model.load_state_dict(weight["state_dict"])

Registerschema = {'name': {'type': 'string', 'required': True},
                  'username': {'type': 'string', 'required': True},
                  'password': {'type': 'string', 'required': True},
                  'focalLength': {'type': 'number', 'required': True},
                  'height': {'type': 'number', 'required': True},
                  'width': {'type': 'number', 'required': True}}


def percent_sky_region(img):
    sky_pixel = np.count_nonzero(img)
    x, y = img.shape
    return(float(sky_pixel)/float(x*y))*100


def is_logged_in(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            return jsonify(error="Not Authenticated")
    return wrap


def get_transforms(mean=(0.485, 0.456, 0.406),
                   std=(0.229, 0.224, 0.225)):
    list_transforms = []
    list_transforms.extend(
        [Resize(256, 320, interpolation=2),
            Normalize(mean=mean, std=std, p=1),
            ToTensor(),
         ]
    )
    list_trfms = Compose(list_transforms)
    return list_trfms


def post_process(probability, threshold, min_size):
    '''Post processing of each predicted mask, components with lesser number of pixels
    than `min_size` are ignored'''
    mask = cv2.threshold(probability, threshold, 1, cv2.THRESH_BINARY)[1]
    num_component, component = cv2.connectedComponents(mask.astype(np.uint8))
    predictions = np.zeros((256, 320), np.int32)
    num = 0
    for c in range(1, num_component):
        p = (component == c)
        if p.sum() > min_size:
            predictions[p] = 1
            num += 1
    return predictions, num


def angle_arr(image):
    arr = []
    for i in range(320):
        for j in range(256):
            if image[j][i] == 0:
                break

        if j < 256:
            angle = (30.0/256.0)*(128-j)
            arr.append(angle)
        else:
            angle = (30.0/256.0)*(-128)
            arr.append(angle)

    return arr


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/register', methods=['POST'])
def register():
    RegisterValidator = Validator(Registerschema)
    data = json.loads(request.stream.read().decode())
    print(data)
    if request.method == 'POST' and RegisterValidator.validate(data):
        name = data['name']
        username = data['username']
        password = sha256_crypt.encrypt(str(data['password']))
        focalLength = data['focalLength']
        height = data['height']
        width = data['width']

        # Create cursor
        cur = mysql.connection.cursor()

        # Execute query
        cur.execute("INSERT INTO USERS(name, username, password, focalLength, height, width) VALUES(%s, %s, %s, %s,%s,%s)",
                    (name, username, password, focalLength, height, width))

        # Commit to DB
        mysql.connection.commit()

        # Close connection
        cur.close()

        return jsonify(msg="Successfully Registered. You can now log in to continue.")

    return jsonify(error=RegisterValidator.errors)

# User login


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        # Get Form Fields
        print(request)
        username = request.json['username']
        password_candidate = request.json['password']
        # Create cursor
        cur = mysql.connection.cursor()

        # Get user by username
        result = cur.execute(
            "SELECT * FROM USERS WHERE username = %s", [username])

        if result > 0:
            # Get stored hash
            data = cur.fetchone()
            password = data['password']

            # Compare Passwords
            if sha256_crypt.verify(password_candidate, password):
                # Passed
                session['logged_in'] = True
                session['username'] = username
                app.logger.info('Password matched !')
                return jsonify(success=True)
            else:
                error = 'Invalid login'
                app.logger.info('Not matched !')
                return jsonify(success=False)
            # Close connection
            cur.close()
        else:
            error = 'Username not found'
            return jsonify(success=False)

    return jsonify(success=False)

# Logout


@app.route('/logout')
@is_logged_in
def logout():
    session.clear()
    return jsonify(success=True)


@app.route('/get_mask', methods=['POST'])
def getMask():
    if request.method == 'POST':
        if 'image' not in request.files:
            return jsonify(error="No files selected")
        file = request.files['image']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            return jsonify(error="No files selected")
        if file:
            filename = werkzeug.utils.secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            mask_image_name = 'mask_'+filename
            # Create cursor
            img = mpi.imread('public/'+filename)
            transforms = get_transforms()
            augmented = transforms(image=img)
            img = augmented['image']
            # print(img.shape[0])
            img = img.reshape(1, 3, img.shape[1], img.shape[2])
            # print(img.shape)
            # mask = augmented['mask'] # 1x256x1600x4
            #mask = mask[0].permute(2, 0, 1)
            mage = model.predict(img)
            mage2 = torch.sigmoid(mage)
            mage2 = mage2.reshape(256, 320).numpy()
            mage3, num = post_process(mage2, mage2.mean(), 50)
            # cv2.imwrite('public/'+mask_image_name, mage3)
            percent = percent_sky_region(mage3)
            plt.imsave('public/'+mask_image_name, mage3, cmap='gray')
            array_angle = angle_arr(mage3)

            cur = mysql.connection.cursor()

            username = request.form['username']

            anglesList = json.dumps(array_angle)
            # Execute query
            cur.execute("INSERT INTO HISTORIES(username,image,mask,angles,percent) VALUES( % s, % s, % s, % s, %s)",
                        (username, filename, mask_image_name, anglesList, percent))

            # Commit to DB
            mysql.connection.commit()

            # Close connection
            cur.close()
            return jsonify(image=filename, mask=mask_image_name, angles=anglesList, percent=percent)
        # return jsonify(msg="Successfully Uploaded image")

    return jsonify(error="Some error occured", success=False)


@app.route('/get_histories', methods=['POST'])
def getHistories():
    if request.method == 'POST':
        cur = mysql.connection.cursor()
        username = request.form['username']
        # Execute query
        result = cur.execute(
            "SELECT * FROM HISTORIES WHERE username = %s", [username])
        histories = cur.fetchall()

    if result > 0:

        return jsonify(histories=histories, success=True)
    else:
        return jsonify(msg="No histories yet. Explore the 'get mask' feature in Menu")
    return jsonify(error="Some error occured", success=False)


if __name__ == 'main':
    app.run(debug=True)
