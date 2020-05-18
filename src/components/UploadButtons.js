import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import "./css/Upload.css";
import React, { Component } from "react";
import axios from "axios";

class UploadButtons extends Component {
  constructor() {
    super();
  }
  state = {
    // Initially, no file is selected
    selectedFile: null,
  };
  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };
  // On file upload (click the upload button)
  onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();
    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    // Details of the uploaded file
    console.log(this.state.selectedFile);
    // Request made to the backend api
    // Send formData object
    axios.post("api/uploadfile", formData);
  };
  render() {
    return (
      <div>
        <input
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
          onChange={this.onFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={this.onFileUpload}
          >
            Upload
          </Button>
        </label>
        <label htmlFor="icon-button-file">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
        <div className="imgPreview"></div>
      </div>
    );
  }
}

export default UploadButtons;
