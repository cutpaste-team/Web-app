import React, { Component } from "react";
import { Button, Radio } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CopyOutlined } from '@ant-design/icons';
import "./css/Upload.css";
import Bg1 from "../images/Bg-1.png";
import Bg2 from "../images/Bg-2.png";
import Bg3 from "../images/Bg-3.png";
import Bg4 from "../images/Bg-4.png";
import Bg5 from "../images/Bg-5.png";

class ContainedButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    this.setState({
      url: value,
    });
  }
  render() {
    const size = "default";
    const { Option } = Select;

    function onBlur() {
      console.log("blur");
    }

    function onFocus() {
      console.log("focus");
    }

    function onSearch(val) {
      console.log("search:", val);
    }
    return (
      <div className="dowload-paste">
        <Space>
          {" "}
          <Button type="primary" icon={<DownloadOutlined />} size={size}>
            Download
          </Button>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select background"
            optionFilterProp="children"
            onChange={this.onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="jack">None</Option>
            <Option value={Bg1}>Background-1</Option>
            <Option value={Bg2}>Background-2</Option>
            <Option value={Bg3}>Background-3</Option>
            <Option value={Bg4}>Background-4</Option>
            <Option value={Bg5}>Background-5</Option>
          </Select>
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
