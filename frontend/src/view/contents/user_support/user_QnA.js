import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import Pagination from "../../components/pagination.js";
import InsertQnA from "./insert_QnA.js";
import { getCookie } from "../user/cookies"
import axios from "axios";

class UserQnA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post: [],
      title: "",
      user_tier: "",
      selectType: "",
      Answered_title: "",
      Answered_Modify_title: "",
      Questions: "",
      QuestionOpen: false,
      QuestionAnsweredOpen: false,
      InsertOpen: false,
      current_page: 1,
    };
    this.type = { 0: "기타", 1: "동영상", 2: "상품", 3: "AI", 4: "광고" };
    this.setPost = this.setPost.bind(this);
    this.userQnA = this.userQnA.bind(this);
    this.userQnA();
  }

  userQnA() {
    axios
      .get("/UserQnA", {
        params: { token: getCookie("boshow_token") },
      })
      .then((response) => {
        this.setState({
          posts: response.data[0].data,
          user_tier: response.data[0].tier,
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

  onInsertQnA(e) {
    e.preventDefault();
    this.setState({
      InsertOpen: true,
    });
  }

  ChangeListType(e) {
    if (e.target.value !== "") {
      this.setState({
        [e.target.name]: e.target.value,
      });
      console.log(e.target.value);
      axios
        .get("/UserQnA", {
          params: {
            token: getCookie("boshow_token"),
            values: e.target.value,
            mode: "selected",
          },
        })
        .then((response) => {
          this.setState({
            posts: response.data[0].data,
            user_tier: response.data[0].tier,
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
    var token = getCookie("boshow_token");
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    var idx = JSON.parse(jsonPayload).idx;
    if (this.state.QuestionOpen && this.state.Questions.idx === Question.idx) {
      this.setState({
        QuestionOpen: false,
        Questions: Question,
        Answered_title: "",
        Answered_Modify_title: "",
      });
    } else {
      this.setState({
        QuestionOpen: true,
        Questions: Question,
        Answered_title: "",
        Answered_Modify_title: "",
      });
    }
  }

  QuestionAnsweredAdd(title, list) {
    if (title !== "") {
      axios
        .put("/UserQnA", null, {
          params: {
            answer: title,
            idx: list.idx,
            token: getCookie("boshow_token"),
          },
        })
        .then((response) => {
          alert("답변등록 완료");
          this.userQnA();
        })
        .catch((response) => {
          console.log(response);
        }); // ERROR]
    } else {
      alert("등록할 답변을 입력해주세요");
    }
  }

  QuestionAnsweredModify(title, list) {
    if (title !== "") {
      axios
        .put("/UserQnA", null, {
          params: {
            answer: title,
            idx: list.idx,
            token: getCookie("boshow_token"),
            mode: "QnAModify",
          },
        })
        .then((response) => {
          alert("답변수정 완료");
          this.userQnA();
        })
        .catch((response) => {
          console.log(response);
        }); // ERROR
    } else {
      alert("수정할 답변을 입력해주세요");
    }
  }

  changeTitle(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  questionRemove = (menuIdx, userIdx) => {
    const confirmRemove = window.confirm('문의를 정말 삭제하시겠습니까?');

    if(confirmRemove !== false){
      axios.delete('/UserQnA', { params : {
        idx : menuIdx,
        userIdx : userIdx
      }})
      .then((response) => {
        const removedPosts = this.state.posts.filter(post => {
          return post.idx !== menuIdx
        })

        this.setPost({
          posts : removedPosts
        })
      })
    }
  }

  render() {
    const btn_file = {
      width: "50px",
      minwidth: "100%",
      minheight: "100%",
      outline: "none",
      backgroundColor : 'white',
      border : '0.5px solid #a5a5a5',
      color : '#a5a5a5',
      cursor: "inherit",
      borderRadius : '6px',
      position: 'relative',
      left:'1050px',
      display: "block",
    };

    const show_count = 10;
    const page_count = 5;
    const QnA_list = this.state.post.map((menu) => (
      <tbody>
        {/* className={menu.type===parseInt(this.state.selectType)?"active":this.state.selectType === ''?"active":"hide"} */}
        <tr key={menu.idx} onClick={this.QuestionClick.bind(this, menu)}>
          <td>{menu.idx}</td>
          <td style={{textAlign:"left"}}>{menu.title}</td>
          <td>{this.type[menu.type]}</td>
          <td>{menu.user_name}</td>
          <td>{menu.status !== 0 ? "답변완료" : "답변미완료"}</td>
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
            <td colSpan="6" className="user_support_board_answer">
              <p>
                <div style={{ color: "red", marginLeft:"143px" }}>Q. </div>{" "}
                {menu.contents.split("\n").map((line) => {
                  return (
                    <span style={{marginLeft:"143px"}}>
                      {line}
                      <br />
                    </span>
                  );
                })}
              </p>
              {menu.answer === null &&
              (this.state.user_tier === 0 || this.state.user_tier === 3) ? (
                <div className="user_support_board_answer_add">
                  <input
                    type="text"
                    name="Answered_title"
                    value={this.state.Answered_title}
                    onChange={this.changeTitle.bind(this)}
                  ></input>
                  <button
                    type="button"
                    onClick={this.QuestionAnsweredAdd.bind(
                      this,
                      this.state.Answered_title,
                      menu
                    )}
                  >
                    답변등록
                  </button>
                </div>
              ) : (
                ""
              )}
              {menu.answer !== null ? (
                <p style={{ backgroundColor: "#f6f2ff"}}>
                  <div style={{ color: "blue" , marginLeft:"143px"}}>A. </div>{" "}
                  {menu.answer.split("\n").map((line) => {
                    return (
                      <span style={{marginLeft:"143px"}}>
                        {line}
                        <br />
                      </span>
                    );
                  })}
                  <div style={{ marginTop: "20px" , marginLeft:"143px"}}>
                    답변자: {menu.answered_name} | 답변일:{" "}
                    {String(menu.answered_time).substring(0, 4) +
                      "-" +
                      String(menu.answered_time).substring(5, 7) +
                      "-" +
                      String(menu.answered_time).substring(8, 10) +
                      " " +
                      String(menu.answered_time).substring(11, 13) +
                      ":" +
                      String(menu.answered_time).substring(14, 16) +
                      ":" +
                      String(menu.answered_time).substring(17, 19)}
                  </div>
                  {/* {(this.state.user_tier === 0 || this.state.user_tier === 3)?
                                        <div>
                                            <input type="text" name="Answered_Modify_title" value={this.state.Answered_Modify_title} onChange={this.changeTitle.bind(this)}></input>
                                            <button type="button" onClick={this.QuestionAnsweredModify.bind(this, this.state.Answered_Modify_title, menu)}>답변수정</button>
                                        </div>:""
                                    } */}
                </p>
              ) : (
                <button onClick={this.questionRemove.bind(this, menu.idx, menu.fk_user_idx)} style={btn_file}>삭제</button>
              )}
            </td>
          </tr>
        ) : (
          ""
        )}
      </tbody>
    ));
    return (
      <>
        {this.state.InsertOpen === false ? (
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
              <table className="table-library" style={ QnA_list.length !== 0 ? {} : { height: '394px' }} >
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
                    <th>답변상태</th>
                    <th>작성일</th>
                  </tr>
                </thead>
                {QnA_list.length !== 0 ? (
                  QnA_list
                ) : (
                  <tbody>
                    <tr>
                      <td></td>
                      <td colSpan="5" className="user_support_board_answer">
                        1:1 문의 내역이 존재하지 않습니다.
                      </td>
                    </tr>
                  </tbody>
                )}
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
            {this.state.user_tier === 0 || this.state.user_tier === 3 ? (
              ""
            ) : (
              <button
                type="button"
                onClick={this.onInsertQnA.bind(this)}
                className="user_support_board_insert"
              >
                글쓰기
              </button>
            )}
          </div>
        ) : (
          <InsertQnA></InsertQnA>
        )}
      </>
    );
  }
}
export default UserQnA;
