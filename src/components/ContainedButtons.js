import React, { Component } from "react";
import { Button, Radio } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { CopyOutlined } from '@ant-design/icons';
import "./css/Upload.css";



class ContainedButtons extends Component {
  render() {
    const size = "default";
    return (
      <div className= "dowload-paste">  
          <Button type="primary"
          icon={<DownloadOutlined />}
            size={size}>
            Download
          </Button>
          
          <Button type="danger"
          icon={<CopyOutlined />} 
          size={size}
            className="paste-icon">
            Paste
          </Button>
        <div className="imgPreview">
          <img src={this.props.images}
              width={280}
              height={270}
              alt=""
          />
                </div>
      </div>
    );
  }
}
export default ContainedButtons;