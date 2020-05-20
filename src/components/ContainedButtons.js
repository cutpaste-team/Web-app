import React, { Component } from "react";
import { Button, Select, Space } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
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
    };
    this.onChange = this.onChange.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
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
        link.setAttribute("download", "image.png"); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.log(error));
  }
  onChange(value) {
    this.setState({
      url: value,
    });
    const file = value;
    const formData = new FormData();
    formData.append("file", file);
    for (var value of formData.values()) {
      console.log(value);
    }
    const config = {
      headers: {
        "Contetnt-Type": "multipart/form-data",
      },
    };
    axios
      .post("localhost:5000/merge", formData, config)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const size = "default";
    const { Option } = Select;
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
          <img
            className="background"
            src={this.state.url}
            width={280}
            height={270}
            alt=""
          />
          <img
            className="picture"
            src={this.props.images}
            width={100}
            height={100}
            alt=""
          />
        </div>
      </div>
    );
  }
}
export default ContainedButtons;
