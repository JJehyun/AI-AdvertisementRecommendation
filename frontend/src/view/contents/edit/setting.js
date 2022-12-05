import React, { Component } from "react";
//import { Link } from "react-router-dom";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import ReactDOM from "react-dom";

import axios from "axios";
import { getCookie } from "../user/cookies.js";

class UserModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userinfo: [],
      posts: [],
    };
    this.userList.bind(this);
    this.userList();
  }

  userList() {
    try {
      axios
        .get(
          "/UserInfoApi",
          null,
          { params: { token: getCookie("boshow_token") } },
          { headers: { "content-type": "application/json" } }
        )
        .then((response) => {
          console.log(response);
          // this.setState({
          //     userinfo: response.data,
          // });
        }) // SUCCESS
        .catch((response) => {
          console.log(response);
        }); // ERROR
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    // const user_list = this.state.userinfo.map((menu) => (
    //         <tr key={menu.idx} className="">
    //             <td>프로필 사진</td>
    //             <td>{menu.tier===0 ? "관리자":(menu.tier===1? "실버": (menu.tier===2? "골드": "다이아"))}</td>
    //             <td>{menu.name}</td>
    //             <td>{menu.id}</td>
    //             <td>{menu.pw}</td>
    //         </tr>
    //     )
    // );
    return (
      <>
        <div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>프로필 사진</th>
                  <th>권한등급</th>
                  <th>이름</th>
                  <th>아이디</th>
                </tr>
                <tr>
                  <th>현재 비밀번호</th>
                  <th>비밀번호 수정</th>
                  <th>비밀번호 확인</th>
                </tr>
                <tr>
                  <th>회사명</th>
                  <th>부서</th>
                  <th>휴대번호</th>
                </tr>
                <tr>
                  <th>이메일</th>
                </tr>
              </thead>
              <tbody>{/* {user_list} */}</tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

class Setting extends Component {
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
          <ul>
            <li>
              <button type="button" onClick={this.level_next.bind(this, 1)}>
                회원정보 수정
              </button>
            </li>
            <li>
              <button type="button" onClick={this.level_next.bind(this, 2)}>
                알람설정
              </button>
            </li>
            <li>
              <button type="button" onClick={this.level_next.bind(this, 3)}>
                휴지통
              </button>
            </li>
          </ul>
          <div className="video_add">
            {this.state.level === 1 && <UserModify></UserModify>}
            {this.state.level === 2 && <p>와!2</p>}
            {this.state.level === 3 && <p>와!3</p>}
          </div>
        </section>
      </>
    );
  }
  //    render() {
  //        return (
  //            <>
  //                <Header mode="editing"></Header>
  //                <Managenav mode="editing" menu="설정"></Managenav>
  //                <section className="content">
  //                    <h1 className="title">설정</h1>
  //                    <ul>
  //                        <li><button type="button" className={ this.props.level === 1}>회원정보 수정</button></li>
  //                        <li><button type="button" className={ this.props.level === 2}>알람설정</button></li>
  //                        <li><button type="button" className={ this.props.level === 3}>휴지통</button></li>
  //                    </ul>
  //                </section>
  //            </>
  //        );
  //    }
}

export default Setting;
