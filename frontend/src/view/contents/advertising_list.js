import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";
import Search from "../../components/search.js";
import Pagination from "../../components/pagination.js";

class AdvertisingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      update_adb: {},
    };
    this.setPost = this.setPost.bind(this);
  }

  async componentDidMount() {
    axios.get("/AdbApi", null).then((response) => {
      if (response.status == 200) {
        this.setState({
          posts: response.data,
        });
      }
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  handleUpdate() {
    var update_adb = {
      update_idx: this.state.update_adb.idx,
      update_name: this.state.update_name,
      update_type: this.state.update_type,
      update_agency: this.state.update_agency,
    };
    console.log(update_adb);
    // axios.patch('/AdbApi', null, {params: update_video})
    // .then(response => {
    //     alert('수정 완료');
    //     window.location.reload(); //새로고침
    // })
  }

  async adbUpdateOn(e) {
    const { value } = e.target;

    await this.setState({
      update_adb: this.state.posts[value],
    });
    if (this.state.update_adb) {
      this.setState({
        update_name: this.state.update_adb.name,
        update_type: this.state.update_adb.type,
        update_agency: this.state.update_adb.adb_agency,
      });
    }
  }

  adbUpdateOff() {
    this.setState({
      update_adb: {},
      update_title: "",
      update_thumbnail: "",
      update_duration: "",
      update_platform: "",
      update_description: "",
      // update_tag: '',
      update_category: "",
    });
  }

  onChangeAdbList(data, page) {
    this.setState({
      post: data.slice((page - 1) * 10, page * 10 - 1),
      posts: data,
      current_page: page,
    });
  }

  parseJwt(token) {
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

    return JSON.parse(jsonPayload);
  }

  setPost(page) {
    this.setState({
      post: this.state.posts.slice((page - 1) * 10, page * 10 - 1),
    });
  }

  render() {
    const ai_connection = ["대기", "완료"];
    const category_list = ["A타입", "B타입", "C타입", "D타입"];

    const show_count = 10;
    const page_count = 5;

    const video_list = this.state.posts.map((menu, key) => (
      <tr key={key}>
        <td>{menu.idx}</td>
        <td>
          <img
            src={
              `${process.env.REACT_APP_BACKEND_HOST}static/adb_images/` + menu.name + ".jpg"
            }
            alt=""
            className="video_list_image"
          ></img>
        </td>
        <td>
          {menu.name}
          <p className="video_list_explanation ng-binding">
            {menu.video_explanation}
          </p>
        </td>
        <td>{category_list[menu.type]}</td>
        <td>{menu.adb_agency}</td>
        <td>{menu.upload_time}</td>
        <td>{menu.fk_user_idx ? menu.fk_user_idx : "관리자"}</td>
        <td>{ai_connection[menu.status]}</td>
        <td>{ai_connection[menu.status]}</td>
        <td>
          <button
            type="button"
            value={key}
            className="search_list_update_btn"
            onClick={this.adbUpdateOn}
          >
            수정
          </button>
          {/* <button type="button" className="search_list_update_btn">복사</button> */}
        </td>
      </tr>
    ));
    return (
      <>
        <Header mode="editing"></Header>
        <Managenav mode="editing" menu="광고 관리" sub="광고"></Managenav>
        <section className="content">
          <h1 className="title">광고 관리</h1>
          <Search
            searchMode="adb_list"
            onSearchValue={this.onChangeAdbList.bind(this)}
          />
          <div className="video_list">
            <div>
              <h1>광고목록 및 상세검색</h1>
              <span>
                전체 {this.state.posts.length > 0 ? this.state.posts.length : 0}
                개
              </span>
              {/* <button onClick={this.handleDelete}>선택삭제</button> */}
            </div>
            <table className="table-library">
              <colgroup>
                <col width="100px" />
                <col width="120px" />
                <col width="300px" />
                <col width="100px" />
                <col width="100px" />
                <col width="100px" />
                <col width="100px" />
                <col width="100px" />
                <col width="70px" />
              </colgroup>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>광고</th>
                  <th></th>
                  <th>타입</th>
                  <th>광고사</th>
                  <th>날짜</th>
                  <th>등록자</th>
                  <th>검수상태</th>
                  <th>송출상태</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{video_list}</tbody>
            </table>
            {this.state.posts.length > 0 && (
              <Pagination
                posts={this.state.posts}
                show_count={show_count}
                page_count={page_count}
                setPost={this.setPost}
              />
            )}
            {this.props.children}
          </div>
        </section>
        {this.state.update_adb.idx ? (
          <div className="video_update">
            <h1>
              광고 수정
              <button type="button" onClick={this.videoUpdateOff}>
                X
              </button>
            </h1>
            <ul>
              <li>
                <img
                  src={this.state.update_thumbnail}
                  alt=""
                  className="video_list_image"
                />
              </li>
            </ul>
            <ul>
              <li>이름</li>
              <li>
                <input
                  type="text"
                  name="update_name"
                  onChange={this.handleChange}
                  value={this.state.update_name}
                />
              </li>
              <li>타입</li>
              <li>
                <select
                  name="update_type"
                  onChange={this.handleChange}
                  value={this.state.update_type}
                >
                  <option value="0">A타입</option>
                  <option value="1">B타입</option>
                  <option value="2">C타입</option>
                  <option value="3">D타입</option>
                </select>
              </li>
              <li>광고사</li>
              <li>
                <input
                  type="text"
                  name="update_tag"
                  onChange={this.handleChange}
                  value={this.state.update_agency}
                />
              </li>
              <button type="button" onClick={this.handleUpdate}>
                저장
              </button>
            </ul>
          </div>
        ) : null}
      </>
    );
  }
}

export default AdvertisingList;
