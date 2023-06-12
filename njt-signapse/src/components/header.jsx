import React, { Component } from "react";
import Form from "./form";
import Speech from "./speech";

export class Header extends Component {
  render() {
    return (
      <div className="header">
        {/* <Form /> */}
        <Speech/>
      </div>
    );
  }
}

export default Header;
