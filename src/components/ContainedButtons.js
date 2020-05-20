import React, { Component } from "react";
import { Button, Select, Space, Slider } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";
import "./css/Upload.css";
import Bg1 from "../images/Bg-1.png";
import Bg2 from "../images/Bg-2.png";
import Bg3 from "../images/Bg-3.png";
import Bg4 from "../images/Bg-4.png";
import Bg5 from "../images/Bg-5.png";
import axios from "axios";

class ContainedButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      sizeImage: 100,
      axisX: 0,
      axisY: 0,
    };
    this.onChange = this.onChange.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
    this.formatter = this.formatter.bind(this);
    this.onChangeSlider = this.onChangeSlider.bind(this);
    this.onChangeSliderX = this.onChangeSliderX.bind(this);
    this.onChangeSliderY = this.onChangeSliderY.bind(this);
  }
  downloadImg() {
    axios
      .get("http://localhost:5000/download", {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.log(error));
  }
  onChange(value) {
    this.setState({
      url: value,
    });
  }
  componentDidUpdate() {
    const { url, sizeImage, axisX, axisY } = this.state;
    var data = {
      url: url,
      sizeImage: sizeImage,
      axisX: axisX,
      axisY: axisY,
    };
    axios
      .post("http://localhost:5000/merge", data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  formatter(value) {
    return `${value}%`;
  }
  onChangeSlider(value) {
    this.setState({
      sizeImage: value,
    });
  }
  onChangeSliderX(value) {
    this.setState({
      axisX: value,
    });
  }
  onChangeSliderY(value) {
    this.setState({
      axisY: value,
    });
  }
  render() {
    const size = "default";
    const { Option } = Select;
    const { axisX, axisY, sizeImage } = this.state;
    return (
      <div className="dowload-paste">
        <Space>
          {" "}
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select background"
            optionFilterProp="children"
            onChange={this.onChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="">None</Option>
            <Option value={Bg1}>Background-1</Option>
            <Option value={Bg2}>Background-2</Option>
            <Option value={Bg3}>Background-3</Option>
            <Option value={Bg4}>Background-4</Option>
            <Option value={Bg5}>Background-5</Option>
          </Select>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size={size}
            onClick={this.downloadImg}
          >
            Download
          </Button>
        </Space>
        <div className="imgPreview">
          <img className="background" src={this.state.url} alt="" />
          <img
            className="picture"
            src={this.props.images}
            style={{
              width: `${sizeImage}%`,
              left: `${axisX}%`,
              bottom: `${axisY}%`,
            }}
          />
        </div>
        <div className="boxSlider">
          <h4>Adjust</h4>
          <Slider
            tipFormatter={this.formatter}
            defaultValue={100}
            onChange={this.onChangeSlider}
          >
            {" "}
            Size
          </Slider>
          <Slider tipFormatter={this.formatter} onChange={this.onChangeSliderX}>
            {" "}
            X
          </Slider>
          <Slider tipFormatter={this.formatter} onChange={this.onChangeSliderY}>
            {" "}
            Y
          </Slider>
        </div>
      </div>
    );
  }
}
export default ContainedButtons;
