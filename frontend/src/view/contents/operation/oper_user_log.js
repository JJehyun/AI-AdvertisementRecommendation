import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";
// import { Link } from "react-router-dom";

class OpUserLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      posts: [],
    };
    this.userList.bind(this);
    this.userList();
  }

  userList() {
    try {
      axios
        .get("/UserLogApi", null, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          this.setState({
            posts: response.data,
          });
        }) // SUCCESS
        .catch((response) => {
          console.log(response);
        }); // ERROR
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const user_list = this.state.posts.map((menu) => (
      <tr key={menu.idx} className="">
        <td>{menu.user_name}</td>
        <td>
          {menu.user_tier === "0"
            ? "관리자"
            : menu.user_tier === "1"
            ? "실버"
            : menu.user_tier === "2"
            ? "골드"
            : "다이아"}
        </td>
        <td>{menu.user_dept}</td>
        <td>{menu.user_id}</td>
        <td>
          {String(menu.login_time).substring(0, 4)}-
          {String(menu.login_time).substring(5, 7)}-
          {String(menu.login_time).substring(8, 10)}{" "}
          {String(menu.login_time).substring(11, 13)}:
          {String(menu.login_time).substring(14, 16)}:
          {String(menu.login_time).substring(17, 19)}
        </td>
        {menu.logout_time !== null ? (
          <td>
            {String(menu.logout_time).substring(0, 4)}-
            {String(menu.logout_time).substring(5, 7)}-
            {String(menu.logout_time).substring(8, 10)}{" "}
            {String(menu.logout_time).substring(11, 13)}:
            {String(menu.logout_time).substring(14, 16)}:
            {String(menu.logout_time).substring(17, 19)}
          </td>
        ) : (
          <td>로그인 중</td>
        )}
      </tr>
    ));
    return (
      <>
        <Header mode="operation"></Header>
        <Managenav mode="operation" menu="관리" sub_menu="활동기록"></Managenav>
        <section className="content">
          <h1 className="title">활동기록</h1>
          <div className="video_add user_rank_frame">
            <table className="user_rank">
              <colgroup>
                <col width="100px" />
                <col width="100px" />
                <col width="150px" />
                <col width="100px" />
                <col width="200px" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>등급</th>
                  <th>부서</th>
                  <th>아이디</th>
                  <th>로그인</th>
                  <th>로그아웃</th>
                </tr>
              </thead>
              <tbody>{user_list}</tbody>
            </table>
          </div>
        </section>
      </>
    );
  }
}

export default OpUserLog;
