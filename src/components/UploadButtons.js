import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import "./css/Upload.css";
import React, { Component } from "react";
import axios from "axios";

class UploadButtons extends Component {
  constructor() {
    super();
    this.state = {
      previewImageUrl: false,
      imageHeight: 200,
      imagePrediction: "",
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
      .post("http://09eecc97.ngrok.io", formData, config)
      .then(function (response) {
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
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={this.uploadHandler}
        >
          Upload
        </Button>
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
        <div className="imgPreview">
          {this.state.previewImageUrl && (
            <img
              height={this.state.imageHeight}
              alt=""
              src={this.state.previewImageUrl}
            />
          )}
        </div>
      </div>
    );
  }
}

export default UploadButtons;
