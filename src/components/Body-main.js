import React, { Component } from "react";
import "./css/Body.css";
import Box from "@material-ui/core/Box";
import { Row, Col } from "antd";
import UploadButtons from "./UploadButtons";
import LinearDeterminate from "./LinearDeterminate";
import ContainedButtons from "./ContainedButtons";

export default class Body extends Component {
  render() {
    return (
      <div className="Body">
        <Row /**3 border cut, paste, process bar */>
          <Col span={7}>
            <UploadButtons></UploadButtons>
          </Col>
          <Col span={10}>
            <LinearDeterminate></LinearDeterminate>
          </Col>
          <Col span={7}>
            <ContainedButtons />
          </Col>
        </Row>
      </div>
    );
  }
}
