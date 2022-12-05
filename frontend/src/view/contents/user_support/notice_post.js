import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

import axios from "axios";

class NoticePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_post:
        this.props.prev_next_list.length === 2 &&
        this.props.prev_next_list[0].idx === 1
          ? this.props.prev_next_list[0]
          : this.props.prev_next_list.length === 2 &&
            this.props.prev_next_list[1].idx === this.props.currnet_idx
          ? this.props.prev_next_list[1]
          : this.props.prev_next_list[1],
      prev_next_list: this.props.prev_next_list,
      prev_next_len: this.props.prev_next_list.length,
    };
  }

  selectedPost = (post_list) => {
    axios
      .get("/UserNotice", { params: { idx: post_list.idx, mode: "checkList" } })
      .then((response) => {
        var data = response.data;
        this.setState({
          selected_post:
            data.length === 2 && data[0].idx === 1
              ? data[0]
              : data.length === 2 && data[1].idx === post_list.idx
              ? data[1]
              : data[1],
          prev_next_list: data,
          prev_next_len: data.length,
        });
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      }); // ERROR]
  };

  prev_post(prev, e) {
    e.preventDefault();
    this.selectedPost(prev);
  }

  next_post(next, e) {
    e.preventDefault();
    this.selectedPost(next);
  }

  render() {
    const week = new Array("일", "월", "화", "수", "목", "금", "토");
    let notice_list;
    if (
      this.state.prev_next_len === 2 &&
      this.state.prev_next_list[0].idx === 1
    ) {
      notice_list = (
        <div className="user_support_board_write_prevnext">
          <p onClick={this.next_post.bind(this, this.state.prev_next_list[1])}>
            <span>다음글</span>
            {this.state.prev_next_list[1].title}
          </p>
        </div>
      );
    } else if (
      this.state.prev_next_len === 2 &&
      this.state.prev_next_list[1].idx === this.state.selected_post.idx
    ) {
      notice_list = (
        <div className="user_support_board_write_prevnext">
          <p onClick={this.prev_post.bind(this, this.state.prev_next_list[0])}>
            <span>이전글</span>
            {this.state.prev_next_list[0].title}
          </p>
        </div>
      );
    } else if (this.state.prev_next_len === 3) {
      notice_list = (
        <div className="user_support_board_write_prevnext">
          <p onClick={this.prev_post.bind(this, this.state.prev_next_list[0])}>
            <span>이전글</span>
            {this.state.prev_next_list[0].title}
          </p>
          <p onClick={this.next_post.bind(this, this.state.prev_next_list[2])}>
            <span>다음글</span>
            {this.state.prev_next_list[2].title}
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="user_support_board_write">
          <div>
            <table className="table-library">
              <thead>
                <tr>
                  <th>제목</th>
                  <td colSpan="3">{this.state.selected_post.title}</td>
                </tr>
                <tr>
                  <th>작성자</th>
                  <td colSpan="3">{this.state.selected_post.user_name}</td>
                </tr>
                <tr>
                  <th>작성일</th>
                  <td>
                    {String(this.state.selected_post.upload_time).substring(
                      0,
                      4
                    ) +
                      "-" +
                      String(this.state.selected_post.upload_time).substring(
                        5,
                        7
                      ) +
                      "-" +
                      String(this.state.selected_post.upload_time).substring(
                        8,
                        10
                      ) +
                      "-" +
                      week[
                        new Date(this.state.selected_post.upload_time).getDay()
                      ] +
                      " "}
                  </td>
                  <th>조회수</th>
                  <td>{this.state.selected_post.views}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="user_support_board_write_main">
                    {this.state.selected_post.contents
                      .split("\n")
                      .map((line) => {
                        return (
                          <span>
                            {line}
                            <br />
                          </span>
                        );
                      })}
                    <button onClick={this.props.onPrevList}>목록</button>
                  </td>
                </tr>
              </thead>
            </table>
          </div>
          {notice_list}
        </div>
      </>
    );
  }
}
export default NoticePost;
