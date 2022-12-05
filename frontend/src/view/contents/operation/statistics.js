import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
// import { Link } from "react-router-dom";

class OpStatistics extends Component {
  render() {
    return (
      <>
        <Header mode="operation"></Header>
        <Managenav mode="operation" menu="통계분석" sub="통계분석"></Managenav>
        <section class="content">
          <h1 class="title">
            통계분석
            <span>데이터 부족으로 아직 기능하지 않습니다.</span>
          </h1>
          <div class="statistics"></div>
        </section>
      </>
    );
  }
}

export default OpStatistics;
