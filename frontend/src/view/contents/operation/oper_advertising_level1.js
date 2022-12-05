import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";
import Search from "../../components/search.js";
import { numberPad } from "../../components/common";

class OpAdvertisingListLevel1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post: [],
      delete_video: [],
      selected_video: [],
      update_video: {},
      current_page: 1,
    };
    this.seletedVideo = [];
    // this.handleChange = this.handleChange.bind(this);
    this.handleUpdete = this.handleUpdete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    axios.get("/VideoApi", null).then((response) => {
      if (response.status == 200) {
        this.setState({
          posts: response.data,
        });
      }
    });
  }

  // handleChange(e) {
  //     if (e.target.name === "idx") {
  //         let idx = Number(e.target.value);
  //         let delete_video = this.state.delete_video;

  //         if (e.target.checked) {
  //             delete_video.push(idx);
  //         } else {
  //             let index = delete_video.indexOf(idx);
  //             delete_video.splice(index, 1);
  //         }
  //         console.log(delete_video);

  //         this.setState({
  //             delete_video: delete_video
  //         })
  //     } else {
  //         this.setState({
  //             [e.target.name]: e.target.value
  //         });
  //     }
  // }

  checkChange(videoList, e) {
    const checkOneVideo = document.getElementById(e.target.id);
    if (e.target.checked) {
      const check_video = document.getElementsByName("video_idx");
      check_video.forEach((video) => {
        video.checked = false;
      });
      checkOneVideo.checked = true;
      this.seletedVideo.splice(0);
      this.seletedVideo.push({ video: videoList });
    } else {
      checkOneVideo.checked = false;
      this.seletedVideo.splice(0);
    }
  }

  handleDelete() {}

  handleUpdete(e) {
    let idx = e.target.value;

    let update_video = this.state.posts.filter((data) => {
      return data.idx == idx;
    });

    this.setState({
      update_video: update_video[0],
    });
  }

  onNextVideo(video, e) {
    e.preventDefault();
    console.log(video);
    this.props.next_level(video);
  }

  onChangeVideoAdbList(data) {
    var page = 1;
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
      post: this.state.posts.slice((page - 1) * 4, page * 4),
    });
    this.seletedVideo.splice(0);
  }

  paginate(page) {
    this.setState({
      current_page: page,
    });
    this.seletedVideo.splice(0);
  }

  render() {
    const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
    const ai_connection = ["미연결", "연결"];
    const transmission_status = ["대기", "완료"];
    const category_list = [
      "기타",
      "예능",
      "스포츠/취미",
      "드라마",
      "고양",
      "애니메이션",
      "키즈",
    ];
    const user_idx = localStorage.getItem("user_idx");
    const week = new Array("일", "월", "화", "수", "목", "금", "토");

    const show_video_count = 4;
    const page_count = 5;

    const start_page = Math.floor(this.state.current_page / page_count) + 1;
    const last_page = Math.ceil(this.state.posts.length / show_video_count);
    const end_page = start_page + 4 > last_page ? last_page : start_page + 4;

    const show_video = this.state.posts.slice(
      (this.state.current_page - 1) * show_video_count,
      this.state.current_page * show_video_count - 1
    );

    const video_list = show_video.map((menu) => (
      <tr key={menu.idx}>
        <td>
          <input
            type="checkbox"
            id={"list" + menu.idx}
            name="video_idx"
            value={menu.idx}
            onChange={this.checkChange.bind(this, menu)}
          />
          <label for={"list" + menu.idx}>
            <span></span>
          </label>
        </td>
        <td>{menu.idx}</td>
        <td>
          {menu.platform === "직접 업로드" ? (
            <img
              src={image_path + "videos/" + String(menu.idx) + "_thumbnail.jpg"}
              alt=""
              className="video_list_image"
            />
          ) : (
            <img src={menu.thumbnail} alt="" className="video_list_image" />
          )}
          {menu.title}
        </td>
        <td>{menu.view}</td>
        <td>
          {numberPad(menu.duration / 3600, 2) +
            ":" +
            numberPad((menu.duration % 3600) / 60, 2) +
            ":" +
            numberPad(menu.duration % 60, 2)}
        </td>
        <td>{category_list[menu.category]}</td>
        <td>
          <p>
            {String(menu.upload_time).substring(0, 4) +
              "-" +
              String(menu.upload_time).substring(5, 7) +
              "-" +
              String(menu.upload_time).substring(8, 10) +
              "-" +
              week[new Date(menu.upload_time).getDay()] +
              " "}
          </p>
          <p>
            {String(menu.upload_time).substring(11, 13) +
              ":" +
              String(menu.upload_time).substring(14, 16) +
              ":" +
              String(menu.upload_time).substring(17, 19)}
          </p>
        </td>
        <td>{menu.user_name}</td>
        <td>{ai_connection[menu.ai_connection]}</td>
        <td>{transmission_status[menu.transmission_status]}</td>
      </tr>
    ));

    const page_number = [];

    for (let i = start_page; i <= end_page; i++) {
      page_number.push(i);
    }

    const pageing = (
      <ul className="pagination">
        <li onClick={() => this.paginate(1)}>&laquo;</li>
        {this.state.current_page > 1 ? (
          <li onClick={() => this.paginate(this.state.current_page - 1)}>
            &lt;
          </li>
        ) : (
          <li>&lt;</li>
        )}
        {page_number.map((pageNum) => (
          <li
            key={pageNum}
            className="pagination_item"
            onClick={() => this.paginate(pageNum)}
          >
            {pageNum}
          </li>
        ))}
        {this.state.current_page < last_page ? (
          <li onClick={() => this.paginate(this.state.current_page + 1)}>
            &gt;
          </li>
        ) : (
          <li>&gt;</li>
        )}
        <li onClick={() => this.paginate(last_page)}>&raquo;</li>
      </ul>
    );

    const update_video = this.state.update_video;

    return (
      <>
        <section className="content">
          <h1 className="title">광고</h1>
          <Search
            searchMode="video_list"
            onSearchValue={this.onChangeVideoAdbList.bind(this)}
          />
          <div className="video_list">
            <div>
              <h1>동영상 목록 및 상세검색</h1>
              <span>전체 {this.state.posts.length}개</span>
            </div>
            <table className="table-library">
              <colgroup>
                <col width="50px" />
                <col width="50px" />
                <col width="300px" />
                <col width="100px" />
                <col width="100px" />
                <col width="100px" />
                <col width="120px" />
                <col width="100px" />
                <col width="100px" />
                <col width="150px" />
              </colgroup>
              <thead>
                <tr>
                  <th></th>
                  <th>번호</th>
                  <th>동영상</th>
                  <th>조회수 ↓</th>
                  <th>영상길이</th>
                  <th>카테고리</th>
                  <th>날짜</th>
                  <th>등록자</th>
                  <th>AI연결여부</th>
                  <th>송출상태</th>
                </tr>
              </thead>
              <tbody>{video_list}</tbody>
            </table>
            {pageing}
            <button
              type="button"
              onClick={this.onNextVideo.bind(this, this.seletedVideo)}
            >
              다음
            </button>
          </div>
        </section>
      </>
    );
  }
}

export default OpAdvertisingListLevel1;
