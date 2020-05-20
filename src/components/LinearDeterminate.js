import React, { Component } from "react";
import { Button } from "antd";
import "./css/cutbtn.css";
import { ScissorOutlined } from "@ant-design/icons";
class LinearDeterminate extends Component {
  render() {
    return (
      <div className="cut-btn">
        <Button
          type="primary"
          size="default"
          icon={<ScissorOutlined />}
          onClick={this.props.onclick}
        >
          Cut
        </Button>
      </div>
    );
  }
}

export default LinearDeterminate;
