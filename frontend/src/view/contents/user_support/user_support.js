import React, { Component } from "react";
//import { Link } from "react-router-dom";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import ReactDOM from "react-dom";

import axios from "axios";

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  render() {
    return (
      <>
        <div className="user_support">
          <div className="notice">
            <table>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>조회수</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    [업데이트] 2021년 3월 15일 Boshow의 통합관리시스템이
                    업데이트됩니다.
                  </td>
                  <td>Boshow</td>
                  <td>841</td>
                  <td>2021-01-14-목</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
class FrequentlyQuestions extends Component {
  render() {
    return (
      <>
        {/* <div className="user_modify">
                    <div className="user_notification">
                        <table>
                            <tr>
                                <th>권한변경 알람</th>
                                <td>
                                    <label class="switch-button">
                                        <input type="checkbox"/>
                                        <span class="onoff-switch"></span>
                                    </label>
                                </td>
                                <th>관리자 승인 알람</th>
                                <td>
                                    <label class="switch-button">
                                        <input type="checkbox"/>
                                        <span class="onoff-switch"></span>
                                    </label>
                                </td>
                            </tr>
                        </table>
                        <span className="user_support_submit_btn">
                            <button type="submit">저장</button>
                        </span>
                    </div>
                </div> */}
      </>
    );
  }
}

class UserSupport extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      level: 1,
    };
  }

  level_next(next) {
    this.setState({
      level: next,
    });
  }
  render() {
    return (
      <>
        <Header mode="editing"></Header>
        <Managenav mode="editing" menu="설정"></Managenav>
        <section className="content make_ai">
          <h1 className="title">설정</h1>
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
            {this.state.level === 1 && <Notice></Notice>}
            {this.state.level === 2 && (
              <FrequentlyQuestions></FrequentlyQuestions>
            )}
            {this.state.level === 3 && <p>와!3</p>}
          </div>
        </section>
      </>
    );
  }
}

export default UserSetting;
