import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import "./css/cutbtn.css";

class LinearDeterminate extends Component {
  render() {
    return (
      <div className="cut-btn">
        <Button
          variant="contained"
          color="primary"
          onClick={this.props.onclick}
        >
          Cut
        </Button>
      </div>
    );
  }
}

export default LinearDeterminate;
