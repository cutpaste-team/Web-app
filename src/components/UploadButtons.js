import { Button, Radio } from "antd";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import "./css/Upload.css";
import React, { Component } from "react";
import axios from "axios";
import { notification } from "antd";

class UploadButtons extends Component {
  constructor() {
    super();
    this.state = {
      previewImageUrl: false,
      imageHeight: 200,
      imagePrediction: "",
      uploadButton: false,
    };
    this.generatePreviewImageUrl = this.generatePreviewImageUrl.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
  }
  // Function for previewing the chosen image
  generatePreviewImageUrl(file, callback) {
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);
    reader.onloadend = (e) => callback(reader.result);
  }
  // Event handler when image is chosen
  handleChange(event) {
    this.setState({ uploadButton: true });

    const file = event.target.files[0];
    // If the image upload is cancelled
    if (!file) {
      return;
    }

    this.setState({ imageFile: file });
    this.generatePreviewImageUrl(file, (previewImageUrl) => {
      this.setState({
        previewImageUrl,
        imagePrediction: "",
      });
    });
  }
  // Function for sending image to the backend
  uploadHandler(e) {
    var self = this;
    const formData = new FormData();
    formData.append("file", this.state.imageFile, "img.png");

    var t0 = performance.now();
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://127.0.0.1:5000/upload", formData, config)
      .then(function (response) {
        const openNotificationWithIcon = (type) => {
          notification[type]({
            message: "Notification",
            description: "Uploaded success",
          });
        };
        openNotificationWithIcon("success");
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          onChange={this.handleChange}
        />

        <div className="upload-icon">
          {this.state.uploadButton && (
            <Button
              type="primary"
              size="default"
              disable="true"
              onClick={this.uploadHandler}
            >
              Upload
            </Button>
          )}
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </div>
        <div className="imgPreview">
          {this.state.previewImageUrl && (
            <img
              className="preivew"
              height={this.state.imageHeight}
              alt=""
              src={this.state.previewImageUrl}
              width={280}
              height={270}
            />
          )}
        </div>
      </div>
    );
  }
}

export default UploadButtons;
