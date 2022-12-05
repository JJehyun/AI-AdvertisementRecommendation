import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

import axios from "axios";
import { getCookie } from "../user/cookies";

class UserNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: "",
      tier_modify_notify: false,
      admin_notify: false,
    };
    this.userList.bind(this);
    this.userList();
  }
  userList() {
    axios
      .get("/UserInfoApi", {
        params: { boshow_token: getCookie("boshow_token") },
      })
      .then((response) => {
        const res = response.data[0];
        this.setState({
          idx: res.idx,
          tier_modify_notify: res.tier_modify_notify !== 0 ? true : false,
          admin_notify: res.admin_notify !== 0 ? true : false,
        });
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      }); // ERROR
  }

  notifySetting(e) {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  }

  modifyNotify(e) {
    e.preventDefault();
    this.data = {
      modify_mode: "notify",
      idx: this.state.idx,
      tier_modify: this.state.tier_modify_notify,
      admin_modify: this.state.admin_notify,
    };
    axios
      .put("/UserInfoApi", null, { params: this.data })
      .then((response) => {
        this.userList();
        alert("알림설정 수정이 성공적으로 완료 되었습니다.");
      })
      .catch((response) => {
        console.log(response);
      });
  }

  render() {
    return (
      <>
        <div className="user_modify">
          <div className="user_notification">
            <table>
              <tr>
                <th>권한변경 알람</th>
                <td>
                  <label class="switch-button">
                    <input
                      type="checkbox"
                      name="tier_modify_notify"
                      checked={this.state.tier_modify_notify}
                      onChange={this.notifySetting.bind(this)}
                    />
                    <span class="onoff-switch">
                      {this.state.tier_modify_notify === true
                      ? <span class="on_txt">ON</span> : <span class="off_txt">OFF</span>}
                    </span>
                  </label>
                </td>
                <th>관리자 승인 알람</th>
                <td>
                  <label class="switch-button">
                    <input
                      type="checkbox"
                      name="admin_notify"
                      checked={this.state.admin_notify}
                      onChange={this.notifySetting.bind(this)}
                    />
                    <span class="onoff-switch">
                    {this.state.admin_notify === true
                      ? <span class="on_txt">ON</span> : <span class="off_txt">OFF</span>}
                    </span>
                  </label>
                </td>
              </tr>
            </table>
            <span className="user_support_submit_btn">
              <button className="user_submit" type="button" onClick={this.modifyNotify.bind(this)}>
                저장
              </button>
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default UserNotification;
