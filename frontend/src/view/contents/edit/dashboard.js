import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
// import { Link } from "react-router-dom";

class EdDashboard extends Component {
  render() {
    return (
      <>
        <Header mode="editing"></Header>
        <Managenav mode="editing" menu="대시보드"></Managenav>
        <section className="content">
          <h1 className="title">대시보드</h1>
        </section>
      </>
    );
  }
}

export default EdDashboard;
