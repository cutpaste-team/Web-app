import React, { Component } from "react";
import "./css/Body.css";
import UploadButtons from "./UploadButtons";
import LinearDeterminate from "./LinearDeterminate";
import ContainedButtons from "./ContainedButtons";
import axios from "axios";
import { Button, Radio } from 'antd';

export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: "", // image show in the border
      result: false,
      upload: true,
      resultImage: "" //image get from API
    };
    this.getDatas = this.getDatas.bind(this);
    this.getBack = this.getBack.bind(this);
  }
  getDatas() {
    try {
      const dataImage = axios.get(
        "https://express-demo-heroku.herokuapp.com/api/books"
      );
      this.setState({
        images: dataImage.data,
      });
    } catch (error) {
      console.log(error);
    }
    this.setState({result: true, upload: false});

  }
  getBack(){
    this.setState({result: false, upload: true});
  }
  render() {
    return (
      <div className="Body">
            
            <div>
              <UploadButtons></UploadButtons>
              <LinearDeterminate onclick={this.getDatas}></LinearDeterminate>
            </div>
            
             
            <div>
              <ContainedButtons images={this.state.images}/>
              <Button 
                type="primary" 
                 size="default"
                onClick={this.getBack}
              >Try another image</Button>
            </div>
            
      </div>
    );
  }
}
