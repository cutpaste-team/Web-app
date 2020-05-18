import React, { Component } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Head from "./components/Head-main";
import Body from "./components/Body-main";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Head />
        <Body />
      </div>
    );
  }
}

export default App;
