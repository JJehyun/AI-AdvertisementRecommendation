import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import Pagination from "../../components/pagination.js";
import NoticePost from "./notice_post.js";

import axios from "axios";

class UserNotice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post: [],
      title: "",
      current_page: 1,
      openPost: false,
      post_list: [],
      orderbyView: false,
    };
    this.setPost = this.setPost.bind(this);
    this.noticeList = this.noticeList.bind(this);
    this.noticeList();
  }

  noticeList() {
    axios
      .get("/UserNotice")
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

  selectedPost(post_list, open_post) {
    axios
      .get("/UserNotice", { params: { idx: post_list.idx, mode: "checkList" } })
      .then((response) => {
        this.setState({
          notice_list_prev_next: response.data,
          post_list: post_list,
          openPost: open_post,
        });
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      }); // ERROR]
  }

  OrderByDViews(e) {
    e.preventDefault();
    axios
      .get("/UserNotice", { params: { mode: "views" } })
      .then((response) => {
        this.setState({
          posts: response.data,
          orderbyView: true,
        });
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      }); // ERROR]
  }

  OrderByAViews(e) {
    e.preventDefault();
    axios
      .get("/UserNotice", { params: { mode: "views" } })
      .then((response) => {
        this.setState({
          posts: response.data,
          orderbyView: true,
        });
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      }); // ERROR]
  }

  prevList = () => {
    this.noticeList();
    this.setState({
      openPost: false,
    });
  };

  render() {
    const show_count = 10;
    const page_count = 5;
    const week = new Array("일", "월", "화", "수", "목", "금", "토");
    const notice_list = this.state.post.map((menu) => (
      <tr key={menu.idx} onClick={this.selectedPost.bind(this, menu, true)}>
        <th>{menu.idx}</th>
        <th>{menu.title}</th>
        <th>{menu.user_name}</th>
        <th>{menu.views}</th>
        <th>
          {String(menu.upload_time).substring(0, 4) +
            "-" +
            String(menu.upload_time).substring(5, 7) +
            "-" +
            String(menu.upload_time).substring(8, 10) +
            "-" +
            week[new Date(menu.upload_time).getDay()] +
            " "}
        </th>
      </tr>
    ));
    return (
      <>
        {this.state.openPost === false ? (
          <div className="user_support_board">
            <div>
              <table className="table-library">
                <colgroup>
                  <col width="50px" />
                  <col width="700px" />
                  <col width="100px" />
                  <col width="100px" />
                  <col width="150px" />
                </colgroup>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    {/* {
                                        this.state.orderbyView?
                                        <th onClick={this.OrderByAViews.bind(this)}>조회수</th>:
                                        <th onClick={this.OrderByDViews.bind(this)}>조회수▼</th>
                                    } */}
                    <th>작성일</th>
                  </tr>
                </thead>
                <tbody>{notice_list}</tbody>
              </table>
              {this.props.children}
            </div>
            {this.state.posts.length > 0 && (
              <Pagination
                posts={this.state.posts}
                show_count={show_count}
                page_count={page_count}
                current_page={this.state.current_page}
                setPost={this.setPost}
              />
            )}
          </div>
        ) : (
          <NoticePost
            currnet_idx={this.state.post_list.idx}
            post_list={this.state.post_list}
            prev_next_list={this.state.notice_list_prev_next}
            onPrevList={this.prevList}
          ></NoticePost>
        )}
      </>
    );
  }
}
export default UserNotice;
