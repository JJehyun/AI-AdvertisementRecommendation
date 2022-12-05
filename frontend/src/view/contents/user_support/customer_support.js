import React, { Component, useState } from "react";
//import { Link } from "react-router-dom";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import ReactDOM from "react-dom";
import UserNotice from "./user_notice.js";
import UserQnA from "./user_QnA.js";
import UserFAQ from "./user_FAQ.js";

import axios from "axios";

class CustomerSupport extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      level: 1,
      selectType: "",
      mode: String(this.props.location.state.mode),
    };
  }

  level_next(next) {
    this.setState({
      selectType: "",
      level: next,
    });
  }

  render() {
    return (
      <>
        <Header mode={this.state.mode}></Header>
        <Managenav mode={this.state.mode} menu="고객지원"></Managenav>
        <section className="content make_ai">
          <h1 className="title">
            고객지원
            <span>
              Boshow의 새로운 소식들과 유용한 정보들을 한눈에 확인해보세요.
            </span>
          </h1>
          <ul className="user_support_type">
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 1)}
                className={this.state.level == 1 ? "selected" : null}
              >
                공지사항
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 2)}
                className={this.state.level == 2 ? "selected" : null}
              >
                자주하는 질문
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 3)}
                className={this.state.level == 3 ? "selected" : null}
              >
                1:1 문의
              </button>
            </li>
          </ul>
          <div>
            {this.state.level === 1 && <UserNotice />}
            {this.state.level === 2 && <UserFAQ />}
            {this.state.level === 3 && (
              <UserQnA selectType={this.state.selectType} />
            )}
          </div>
        </section>
      </>
    );
  }
}
export default CustomerSupport;
