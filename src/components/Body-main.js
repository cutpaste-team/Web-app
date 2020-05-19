import React, { Component } from "react";
import "./css/Body.css";
import UploadButtons from "./UploadButtons";
import LinearDeterminate from "./LinearDeterminate";
import ContainedButtons from "./ContainedButtons";
import axios from "axios";

export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: "", // image show in the border
      result: false,
      upload: true,
      resultImage: "", //image get from API
    };
    this.getDatas = this.getDatas.bind(this);
    this.getBack = this.getBack.bind(this);
  }
  async getDatas() {
    try {
      const dataImage = await axios.get(
        "http://19c1d9e0.ngrok.io/get-cut-image"
      );
      this.setState({
        images: dataImage.data,
      });
    } catch (error) {
      console.log(error);
    }
    this.setState({ result: true, upload: false });
  }
  getBack() {
    this.setState({ result: false, upload: true });
  }
  render() {
    return (
      <div className="Body">
        <div>
          <UploadButtons></UploadButtons>
          <LinearDeterminate onclick={this.getDatas}></LinearDeterminate>
        </div>

        <div>
          <ContainedButtons
            images={this.state.images}
            result={this.state.result}
          />
        </div>
      </div>
    );
  }
}
