import React, { Component } from "react";
import "./css/Body.css";
import Box from "@material-ui/core/Box";
import { Row, Col } from "antd";
import UploadButtons from "./UploadButtons";
import LinearDeterminate from "./LinearDeterminate";
import ContainedButtons from "./ContainedButtons";
import axios from "axios";

export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: "",
    };
    this.getDatas = this.getDatas.bind(this);
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
  }
  render() {
    return (
      <div className="Body">
        <Row /**3 border cut, paste, process bar */>
          <Col span={7}>
            <UploadButtons></UploadButtons>
          </Col>
          <Col span={10}>
            <LinearDeterminate onclick={this.getDatas}></LinearDeterminate>
          </Col>
          <Col span={7}>
            <ContainedButtons images={this.state.images} />
          </Col>
        </Row>
      </div>
    );
  }
}
