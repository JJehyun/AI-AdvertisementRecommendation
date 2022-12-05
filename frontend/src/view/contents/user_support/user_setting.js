import React, { Component } from "react";
//import { Link } from "react-router-dom";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import UserNotification from "./user_notification.js";
import UserModify from "./user_info_modify.js";
import UserTrashCan from "./user_trashcan.js";

class UserSetting extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      level: this.props.location.state.level ? this.props.location.state.level : 1,
      mode: String(this.props.location.state?.mode),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.state.level && this.props.location.state.level !== prevProps.location.state.level) {
      
      this.setState({
        level: this.props.location.state.level,
      });
    }
  }

  level_next(next) {
    this.setState({
      level: next,
    });
  }

  render() {
    return (
      <>
        <Header mode={this.state.mode}></Header>
        <Managenav mode={this.state.mode} menu="설정"></Managenav>
        <section className="content make_ai">
          <h1 className="title">설정</h1>
          <ul className="user_support_type">
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 1)}
                className={this.state.level == 1 ? "selected" : null}
              >
                회원정보 수정
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 2)}
                className={this.state.level == 2 ? "selected" : null}
              >
                알림설정
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={this.level_next.bind(this, 3)}
                className={this.state.level == 3 ? "selected" : null}
              >
                휴지통
              </button>
            </li>
          </ul>
          <div>
            {this.state.level === 1 && (
              <UserModify ModifyProps={this.props}></UserModify>
            )}
            {this.state.level === 2 && <UserNotification></UserNotification>}
            {this.state.level === 3 && <UserTrashCan></UserTrashCan>}
          </div>
        </section>
      </>
    );
  }
}
export default UserSetting;
