import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import Pagination from "../../components/pagination.js";
import InsertQnA from "./insert_QnA.js";

import axios from "axios";

class UserFAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post: [],
      title: "",
      user_tier: "",
      selectType: "",
      Answered_title: "",
      Questions: "",
      QuestionOpen: false,
      QuestionAnsweredOpen: false,
      InsertOpen: false,
      current_page: 1,
      index: 0,
    };
    this.type = { 0: "기타", 1: "동영상", 2: "상품", 3: "AI", 4: "광고" };
    this.setPost = this.setPost.bind(this);
    this.userQnA = this.userQnA.bind(this);
    this.userQnA();
  }

  userQnA() {
    axios
      .get("/UserFAQ")
      .then((response) => {
        this.setState({
          posts: response.data,
        });
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      }); // ERROR]
  }

  setPost(page) {
    this.setState({
      post: this.state.posts.slice((page - 1) * 10, page * 10 - 1),
      current_page: page,
    });
  }

  ChangeListType(e) {
    if (e.target.value !== "") {
      this.setState({
        [e.target.name]: e.target.value,
      });
      console.log(e.target.value);
      axios
        .get("/UserFAQ", {
          params: { values: e.target.value, mode: "selected" },
        })
        .then((response) => {
          console.log(response.data);
          this.setState({
            posts: response.data,
            post: [],
            current_page: 1,
          });
        }) // SUCCESS
        .catch((response) => {
          console.log(response);
        }); // ERROR]
    } else {
      this.userQnA();
    }
  }

  QuestionClick(Question, e) {
    e.preventDefault();
    if (this.state.QuestionOpen && this.state.Questions.idx === Question.idx) {
      this.setState({
        QuestionOpen: false,
        Questions: Question,
        Answered_title: "",
      });
    } else {
      axios
        .put("/UserFAQ", null, { params: { idx: Question.idx } })
        .then((response) => {
          this.setState({
            QuestionOpen: true,
            Questions: Question,
            Answered_title: "",
          });
          this.userQnA();
        })
        .catch((response) => {
          console.log(response);
        }); // ERROR]
    }
  }

  render() {
    const show_count = 10;
    const page_count = 5;
    const FAQ_list = this.state.post.map((menu) => (
      <>
        <tr key={menu.idx} onClick={this.QuestionClick.bind(this, menu)}>
          <td>{menu.idx}</td>
          <td style={{ textAlign:'left' }}>{menu.title}</td>
          <td>{this.type[menu.type]}</td>
          <td>{menu.user_name}</td>
          <td>{menu.views}</td>
          <td>
            {String(menu.upload_time).substring(0, 4) +
              "-" +
              String(menu.upload_time).substring(5, 7) +
              "-" +
              String(menu.upload_time).substring(8, 10)}
          </td>
        </tr>
        {this.state.QuestionOpen && menu.idx === this.state.Questions.idx ? (
          <tr>
            <td></td>
            <td colSpan="5" className="user_support_board_answer">
              <p>
                {menu.contents.split("\n").map((line) => {
                  return (
                    <span>
                      {line}
                      <br />
                    </span>
                  );
                })}
              </p>
            </td>
          </tr>
        ) : (
          ""
        )}
      </>
    ));
    return (
      <>
        <div className="user_support_board">
          <select
            name="selectType"
            value={this.state.selectType}
            onChange={this.ChangeListType.bind(this)}
          >
            <option value="">선택</option>
            <option value={1}>동영상</option>
            <option value={2}>상품</option>
            <option value={3}>AI</option>
            <option value={4}>광고</option>
            <option value={0}>기타</option>
          </select>
          <div>
            <table className="table-library">
              <colgroup>
                <col width="150px" />
                <col width="600px" />
                <col width="150px" />
                <col width="150px" />
                <col width="150px" />
                <col width="150px" />
              </colgroup>
              <thead>
                <tr>
                  <th>번호</th>
                  <th style={{textAlign:"left"}}>제목</th>
                  <th>유형</th>
                  <th>작성자</th>
                  <th>조회수</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>{FAQ_list}</tbody>
            </table>
            {this.state.posts.length > 0 && (
              <Pagination
                posts={this.state.posts}
                show_count={show_count}
                page_count={page_count}
                current_page={this.state.current_page}
                setPost={this.setPost}
              />
            )}
            {this.props.children}
          </div>
        </div>
      </>
    );
  }
}
export default UserFAQ;
