import React, { Component } from "react";
import ReactDOM from "react-dom";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";

import axios from "axios";
import { getCookie } from "../user/cookies.js";

class AiSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: "",
      duration: ""
    };
    this.userList.bind(this);
    this.userList();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const{name, value} = e.target;

    if( name === "rate") {
      //1~100 숫자만 입력(소수점 제외)
      let rate = String(value).replace(/[^0-9]/g,'');

      if((parseInt(rate) >= 0 && parseInt(rate) <= 100) || rate == "") {
        this.setState({[name] : rate});
      }
    }

    if( name === "duration") {
      //0 제외 숫자만 입력
      let duration = String(value).replace(/[^0-9]/g,'').replace(/(^0+)/,'');
      this.setState({[name]: duration});
      return
    }
  }

  userList() {
    axios
      .get("/AISettingApi", {
        params: { boshow_token: getCookie("boshow_token") },
      })
      .then((response) => {
        const res = response.data[0];
        this.setState({
          rate: res.setting_acc,
          duration: res.setting_loop_time,
        });
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      });
  }

  setAi(e) {
    this.params = {
      boshow_token: getCookie("boshow_token"),
      rate: this.state.rate,
      duration: this.state.duration
    };
    axios.put("/AISettingApi", null, { params: this.params })
    .then((response) => {
      this.userList();
    });
  }



  render() {
    return (
      <>
        <Header mode="editing"></Header>
        <ManageNav mode="editing" menu="AI" sub_menu="설정"></ManageNav>
        <section className="content make_ai">
          <h1 className="title">설정</h1>
          <div className="user_modify">
            <div className="ai_setting">
              <table>
                <tr>
                  <th>AI 인식률</th>
                  <th>AI 지속시간</th>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      className="ai_recognition_rate"
                      name="rate"
                      value={this.state.rate}
                      onChange={this.handleChange}
                    ></input>
                    <span>%</span>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="ai_duration"
                      name="duration"
                      value={this.state.duration}
                      onChange={this.handleChange}
                    ></input>
                    <span>초</span>
                  </td>
                </tr>
              </table>
              <span className="ai_setting_submit_btn">
                <button type="button" onClick={this.setAi.bind(this)}>저장</button>
              </span>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default AiSetting;
