import React, { Component, useState } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import CamaraImg from "../../images/header/photo_setting.png";
import axios from "axios";
import DropZone from "react-dropzone";
import { getCookie } from "../user/cookies";
class UserModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: "",
      user_rank: "",
      user_name: "",
      user_id: "",
      company: "",
      user_pw_update: "",
      user_pw_update_re: "",
      dept: "",
      phone: "",
      email: "",
      now_pw: "",
      try_pw: "",
      update_thumbnail: "",
      updateImg: "",
    };
    //Drop미리 보기 함수
    this.onDrop = (files) => {
      console.log(files[0]);
      this.setState({
        updateImg: files[0],
      });
      let render = new FileReader();
      let file = files[0];
      render.onloadend = () => {
        file = render.result;
        this.setState({
          update_thumbnail: render.result,
        });
      };
      render.readAsDataURL(file);
    };
    this.companyArray = ["코리아퍼스텍", "SBS"];
    this.tierArray = ["관리자", "실버", "골드", "다이아"];
    this.checkUserInfo = [
      {
        pw: false,
        pw_re: false,
        dept: true,
        phone: true,
        email: true,
      },
    ];
    this.userList.bind(this);
    this.userList();
  }

  onChangePhoneValue(e) {
    const phonePattern = /^01([0|1|6|7|8|9]?)?([0-9]{4})?([0-9]{4})$/;
    const emailPattern =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
    const pwPattern =
      /^(?=.*[A-Za-z])(?=.*\d)|(?=.*\d)(?=.*[@$!%*#?&])|(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const { name, value } = e.target;
    if (name === "phone") {
      if (!phonePattern.test(value)) {
        this.checkUserInfo[0].phone = false;
      } else {
        this.checkUserInfo[0].phone = true;
      }
    } else if (name === "email") {
      if (!emailPattern.test(value)) {
        this.checkUserInfo[0].email = false;
      } else {
        this.checkUserInfo[0].email = true;
      }
    } else if (name === "user_pw_update") {
      if (this.state.user_pw_update !== "") {
      if (!pwPattern.test(value)) {
        this.checkUserInfo[0].pw = false;
      } else {
        this.checkUserInfo[0].pw = true;
      }}else{this.checkUserInfo[0].pw = false;}
    } else if (name === "user_pw_update_re") {
      if (this.state.user_pw_update !== "" && value !== "") {
        if (this.state.user_pw_update !== value) {
          this.checkUserInfo[0].pw_re = false;
        } else {
          this.checkUserInfo[0].pw_re = true;
        }
      }
    } else if (name === "dept") {
      if (this.state.dept === "") {
        this.checkUserInfo[0].dept = false;
      } else {
        this.checkUserInfo[0].dept = true;
      }
    }
  }

  onChangeValue(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onDisabledUserInfo(e) {
    e.preventDefault();
    var DisabledUser = window.confirm(
      "회원탈퇴를 해도 기존 데이터는 삭제되지 않습니다. 탈퇴를 계속 진행 하시겠습니까?"
    );
    if (DisabledUser) {
      this.disabledUser = {
        idx: this.state.idx,
        user_id: this.state.user_id,
        email: this.state.email,
        disabled: 0,
      };
      axios
        .delete("/UserInfoApi", { params: this.disabledUser })
        .then((response) => {
          getCookie("boshow_token");
          this.props.ModifyProps.history.push("/login");
          alert("성공적으로 탈퇴처리가 되었습니다.");
        })
        .catch((response) => console.log(response));
    } else {
      alert("회원 탈퇴처리를 취소하셨습니다.");
    }
  }
  
  onSaveUserInfo(e) {
    e.preventDefault();
    if (this.state.user_pw_update == "") return alert("비밀번호를 입력해주세요")
    let checkUserInfo = this.checkUserInfo[0];
    for (var i in this.checkUserInfo[0]) {
      if (!checkUserInfo[i]) {
        if (i === "pw") alert("비밀번호를 올바른 형식으로 입력해주세요");
        else if (i === "pw_re")
          alert("비밀번호 확인하기 위해 한 번 더 입력 해주세요");
        else if (i === "dept") alert("부서를 입력해주세요");
        else if (i === "phone")
          alert("휴대번호를 올바른 형식으로 입력해주세요");
        else if (i === "email") alert("이메일을 올바른 형식으로 입력해주세요");
        return;
      }
    }
    this.updateUser = {
      modify_mode: "user_info",
      idx: this.state.idx,
      pw: this.state.user_pw_update,
      dept: this.state.dept,
      phone: this.state.phone,
      email: this.state.email,
    };
    axios
      .put("/UserInfoApi", null, { params: this.updateUser })
      .then((response) => {
        this.userList();
        //이미지 등록, 이미지 변경을 위한 함수
        var formData = new FormData();
        const boshow_token = getCookie("boshow_token");
        formData.append("files", this.state.updateImg);
        formData.append("boshow_token", boshow_token);
        let params = {};
        params = {
          method: "post",
          url: "/ProfileIMGApi",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        axios(params).then((response) => {
        });
        //여기까지 이미지 변경을 위한 함수
        axios
          .get("/UserInfoApi", {
            params: { boshow_token: getCookie("boshow_token") },
          })
          .then((response) => {
            const res = response.data[0];
            if (res.user_image) {
              this.setState({
                update_thumbnail:
                  `${process.env.REACT_APP_BACKEND_HOST}static/users/` +
                  res.id + "IMG" +
                  res.user_image +
                  ".jpg",
              });
            } else {
              this.setState({
                update_thumbnail:
                  `${process.env.REACT_APP_BACKEND_HOST}static/users/` +
                  res.user_image +
                  ".jpg",
              });
            }
          });
        alert("회원정보 수정이 성공적으로 완료 되었습니다.");
      })
      .catch((response) => {
        console.log(response);
      });
  }

  userList() {
    try {
      axios
        .get("/UserInfoApi", {
          params: { boshow_token: getCookie("boshow_token") },
        })
        .then((response) => {
          console.log(response.data[0])
          const res = response.data[0];
          if (res.user_image) {
            this.setState({
              idx: res.idx,
              user_pw_update: "",
              user_pw_update_re: "",
              user_rank: res.tier,
              user_name: res.name,
              user_id: res.id,
              company: res.fk_company_idx,
              dept: res.dept,
              phone: res.phone,
              email: res.email,
              now_pw: res.pw,
              update_thumbnail:
                `${process.env.REACT_APP_BACKEND_HOST}static/users/` +
                res.id + "IMG" +
                res.user_image +
                ".jpg",
            });
          } else {
            this.setState({
              idx: res.idx,
              user_pw_update: "",
              user_pw_update_re: "",
              user_rank: res.tier,
              user_name: res.name,
              user_id: res.id,
              company: res.fk_company_idx,
              dept: res.dept,
              phone: res.phone,
              email: res.email,
              now_pw: res.pw,
              update_thumbnail:
                `${process.env.REACT_APP_BACKEND_HOST}static/users/` +
                res.user_image +
                ".jpg",
            });
          }
        }) // SUCCESS
        .catch((response) => {
          console.log(response);
        }); // ERROR
    } catch (e) {
      console.log(e);
    }
  }
  checkpassword(e) {
    axios
      .get("/TestJE", {
        params: {
          boshow_token: getCookie("boshow_token"),
          e: e.target.value,
        },
      })
      .then((response) => {
        const a = response.data;
        this.setState({ try_pw: a });
        console.log(this.state.try_pw);
      });
  }
  render() {
    return (
      <>
        <div className="user_modify">
          <div className="user_modify_top">
            <table>
              <thead>
                <tr>
                  {/* <th>프로필 사진</th> */}
                  <th>프로필 사진</th>
                  <th>권한등급</th>
                  <th>이름</th>
                  <th>아이디</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <DropZone className="dropZone" onDrop={this.onDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: "dropzone" })}>
                          <input
                            accept="image/jpg,image/png,image/jpeg,image/gif"
                            name="img"
                            {...getInputProps()}
                            multiple={false}
                          />
                          <div
                            className="IMGDropBox"
                            style={{ position: "relative" }}
                          >
                            <img
                              className="UserImgChange"
                              src={this.state.update_thumbnail}
                            />
                            <div className="IMGCameraDIV">
                              <img className="IMGCamer" src={CamaraImg} />
                            </div>
                          </div>
                        </div>
                      )}
                    </DropZone>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="user_rank"
                      value={this.tierArray[this.state.user_rank]}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="user_name"
                      value={this.state.user_name}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="user_id"
                      value={this.state.user_id}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <span className="user_support_submit_btn">
              <button
                className="user_submit"
                type="button"
                onClick={this.onSaveUserInfo.bind(this)}
              >
                저장
              </button>
              <button
                type="button"
                onClick={this.onDisabledUserInfo.bind(this)}
              >
                탈퇴
              </button>
            </span>
          </div>
          <div className="user_modify_bottom">
            <table>
              <thead>
                <tr>
                  <th>현재 비밀번호</th>
                  <th>비밀번호 수정</th>
                  <th>비밀번호 확인</th>
                </tr>
                <tr>
                  {this.state.try_pw == true ? (
                    <td>
                      <input
                        type="password"
                        name="user_pw"
                        onChange={this.checkpassword.bind(this)}
                        readOnly
                      />
                    </td>
                  ) : (
                    <td>
                      <input
                        type="password"
                        name="user_pw"
                        onChange={this.checkpassword.bind(this)}
                      />
                    </td>
                  )}
                  {this.state.try_pw == false ? (
                    <td>
                      <input
                        type="password"
                        name="user_pw_update"
                        value={this.state.user_pw_update}
                        onChange={this.onChangeValue.bind(this)}
                        onBlur={this.onChangePhoneValue.bind(this)}
                        readOnly
                      />
                    </td>
                  ) : (
                    <td>
                      <input
                        type="password"
                        name="user_pw_update"
                        value={this.state.user_pw_update}
                        onChange={this.onChangeValue.bind(this)}
                        onBlur={this.onChangePhoneValue.bind(this)}
                        required
                      />
                    </td>
                  )}
                  {this.state.try_pw == false ? (
                    <td>
                      <input
                        type="password"
                        name="user_pw_update_re"
                        value={this.state.user_pw_update_re}
                        onChange={this.onChangeValue.bind(this)}
                        onBlur={this.onChangePhoneValue.bind(this)}
                        readOnly
                      />
                    </td>
                  ) : (
                    <td>
                      <input
                        type="password"
                        name="user_pw_update_re"
                        value={this.state.user_pw_update_re}
                        onChange={this.onChangeValue.bind(this)}
                        onBlur={this.onChangePhoneValue.bind(this)}
                        required
                      />
                    </td>
                  )}
                </tr>
                {this.state.try_pw == false ? (
                  <tr>
                    <span style={{ color: "red", fontSize: "12px" }}>
                      비밀번호가 일치하지 않습니다.
                    </span>
                  </tr>
                ) : (
                  <tr>
                    <span style={{ color: "#5388ff", fontSize: "12px" }}>
                      비밀번호가 일치합니다.
                    </span>
                  </tr>
                )}
                <tr>
                  <th>회사명</th>
                  <th>부서</th>
                  <th>휴대번호</th>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      name="company"
                      value={this.companyArray[this.state.company - 1]}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="dept"
                      value={this.state.dept}
                      onChange={this.onChangeValue.bind(this)}
                      onBlur={this.onChangePhoneValue.bind(this)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.onChangeValue.bind(this)}
                      onBlur={this.onChangePhoneValue.bind(this)}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th>이메일</th>
                </tr>
                <tr>
                  <td>
                    <input
                      type="text"
                      name="email"
                      value={this.state.email}
                      onChange={this.onChangeValue.bind(this)}
                      onBlur={this.onChangePhoneValue.bind(this)}
                      required
                    />
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

export default UserModify;
