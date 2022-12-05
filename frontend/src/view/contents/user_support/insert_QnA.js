import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

import axios from "axios";
import { getCookie } from "../user/cookies";

class InsertQnA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      file: [],
      selectType: "",
      contents: "",
    };
    this.file_list = [];
  }

  ChangeListType(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleFileOnChange = (event) => {
    let file = event.target.files;
    if (file.length <= 5) {
      this.file_list.splice(0);
      for (var i = 0; i < file.length; i++) {
        this.file_list.push({ name: file[i].name, id: i, fileList: file[i] });
      }
    } else {
      this.file_list.splice(0);
      alert("최대 5개만 선택해주세요");
    }
    this.setState({
      file: this.file_list,
    });
  };

  insertQnAInfo(e) {
    e.preventDefault();
    if (
      this.state.selectType !== "" &&
      this.state.title !== "" &&
      this.state.contents !== ""
    ) {
      var formData = new FormData();
      for (var i = 0; i < this.state.file.length; i++) {
        formData.append("files_" + i, this.state.file[i].fileList);
      }
      formData.append("file_len", this.state.file.length);
      formData.append("token", getCookie("boshow_token"));
      formData.append("type", this.state.selectType);
      formData.append("title", this.state.title);
      formData.append("contents", this.state.contents);
      formData.append("enctype", "multipart/form-data");
      axios({
        method: "post",
        url: "/UserQnA",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        if (response.status == 200) {
          window.location.reload(); //새로고침;
        } else {
          return false;
        }
      });
    } else {
      alert("등록하실 문의 정보를 전부 입력해주세요!");
    }
  }

  removeFile(id, filename, e) {
    e.preventDefault();
    this.file_list.splice(
      this.file_list.findIndex((obj) => obj.id === id),
      1
    );
    this.setState({
      file: this.file_list,
    });
  }

  render() {
    let file_list_name;
    if (this.state.file.length !== 0) {
      file_list_name = this.state.file.map((file) => (
        <p>
          {file.name}
          <button
            type="button"
            id={"file_" + file.id}
            onClick={this.removeFile.bind(this, file.id, file.name)}
          >
            ㅡ
          </button>
        </p>
      ));
    }

    const btn_file = {
      width: "77px",
      position: "absolute",
      top: "0",
      right: "0",
      minwidth: "100%",
      minheight: "100%",
      fontsize: "100px",
      textalign: "right",
      filter: "alpha(opacity=0)",
      opacity: "0",
      outline: "none",
      background: "white",
      cursor: "inherit",
      display: "block",
    };
    return (
      <>
        <div className="user_support_board_write">
          <div>
            <table className="table-library insert_QnA">
              <thead>
                <tr>
                  <th>제목</th>
                  <td>
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
                    <br />
                    <input
                      type="text"
                      name="title"
                      value={this.state.title}
                      onChange={this.ChangeListType.bind(this)}
                    />
                  </td>
                </tr>
                <tr>
                  <th>내용</th>
                  <td>
                    <textarea
                      name="contents"
                      value={this.state.contents}
                      onChange={this.ChangeListType.bind(this)}
                    ></textarea>
                  </td>
                </tr>
                <tr>
                  <th>이미지</th>
                  <td>
                    <span>
                      파일 선택{" "}
                      <input
                        type="file"
                        style={btn_file}
                        multiple
                        accept="image/jpg,image/png,image/jpeg,image/gif"
                        name="img"
                        onChange={this.handleFileOnChange}
                      ></input>
                    </span>
                    <span style={{ fontSize:'12px', color:'#a5a5a5' }}>최대 5개까지 업로드 가능합니다.</span>
                    <div>{file_list_name}</div>
                    <button
                      type="button"
                      onClick={this.insertQnAInfo.bind(this)}
                      style={{ right:'325px' }}
                    >
                      저장
                    </button>
                  </td>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </>
    );
  }
}
export default InsertQnA;
