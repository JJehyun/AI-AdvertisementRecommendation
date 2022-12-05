import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
// import { Link } from "react-router-dom";

class Category extends Component {
  render() {
    return (
      <>
        <Header mode="editing"></Header>
        <Managenav mode="editing" menu="카테고리 관리"></Managenav>
        <section className="content">
          <h1 className="title">카테고리</h1>
        </section>
      </>
    );
  }
}

export default Category;
