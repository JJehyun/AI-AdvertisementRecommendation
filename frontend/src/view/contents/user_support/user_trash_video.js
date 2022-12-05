import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { numberPad } from "../../components/common";

import axios from "axios";

import ic_search_white from "../../images/common/icons/ic_search_white.png";
import { getCookie } from "../user/cookies";

class UserTrashVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      posts: [],
      title: "",
      idx: "",
    };
    this.selectedVideo = [];
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.videoUrl = this.videoUrl.bind(this);
  }

  videoUrl() {
    axios
      .get("/VideoApi", {
        params: {
          boshow_token: getCookie("boshow_token"),
          mode: "trash",
        },
      })
      .then((response) => {
        if (response.status == 200) {
          this.selectedVideo.splice(0);
          this.setState({
            posts: response.data,
          });
        }
      });
  }

  async componentDidMount() {
    this.videoUrl();
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

  post_search(title, e) {
    e.preventDefault();
    this.searchData = {
      mode: "trash",
      boshow_token: getCookie("boshow_token"),
      title: title,
    };
    axios
      .post(
        "/VideoSearchApi",
        null,
        { params: this.searchData },
        { headers: { "content-type": "application/json" } }
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            posts: response.data,
          });
        }
      });
  }

  post_recovery(e) {
    e.preventDefault();
    if (this.selectedVideo.length !== 0) {
      this.data = {
        mode: "recovery",
        user_idx: this.selectedVideo[0].user_idx,
        Svideo: this.selectedVideo,
      };
      axios.put("/VideoApi", null, { params: this.data }).then((response) => {
        this.videoUrl();
        const check_video = document.getElementsByName("choose_item");
        check_video.forEach((adb) => {
          adb.checked = false;
        });
      });
      return;
    } else {
      alert("복구할 영상을 선택해주세요!");
    }
  }

  onChangeTitle(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleCheckAll = () => {
    const header = document.getElementsByName('all')
    const user_idx = this.state.posts[0].fk_user_idx
    const idx = this.state.posts.map((post) => {
      return post.idx
    })

    if (header[0].checked === true) {
      this.selectedVideo = [];
      idx.map(video_idx => {
        this.selectedVideo.push({ idx: video_idx, user_idx: user_idx });
        this.setState({ idx: idx});
      })
    }
    else {
      this.selectedVideo = [];
      idx.map(video_idx => {
        this.setState({ idx: video_idx});
      })
    }
  }

  checkChange(videoList, e) {
    if (e.target.checked) {
      this.selectedVideo.push({
        idx: e.target.value,
        user_idx: videoList.fk_user_idx,
      });

      this.setState({
        idx : e.target.value,
      });
    } else {
      this.selectedVideo.splice(
        this.selectedVideo.findIndex((obj) => obj.idx === videoList.idx),
        1
      );

      this.setState({
        idx : e.target.value,
      });
    }
  }

  render() {
    const category_list = [
      "기타",
      "예능",
      "스포츠/취미",
      "드라마",
      "고양",
      "애니메이션",
      "키즈",
    ];
    const video_img = `${process.env.REACT_APP_BACKEND_HOST}static/videos/`;
    const video_list = this.state.posts.map((menu, key) => (
      <tr key={key} className={this.selectedVideo.findIndex(video => video.idx == menu.idx) !== -1 ? "selected" : ""}>
        <td>
          <input
            type="checkbox"
            id={"list" + menu.idx}
            name="idx"
            name="choose_item"
            value={menu.idx}
            onChange={this.checkChange.bind(this, menu)}
            checked={this.selectedVideo.findIndex(video => video.idx == menu.idx) !== -1}
          />
          <label for={"list" + menu.idx}>
            <span></span>
          </label>
        </td>
        <td>{menu.idx}</td>
        <td className="menu_title">
          <img 
            alt=""
            className="item_list_image"
            src={menu.platform == '직접 업로드' ? video_img+menu.idx+'_thumbnail.jpg' : menu.thumbnail}
            style={{width:"110px"}}
          />
          <span className="list_description">
            <p>{menu.title}</p>
            <p>{menu.description}</p>
          </span>
        </td>
        <td>
          {numberPad(menu.duration / 3600, 2) +
            ":" +
            numberPad((menu.duration % 3600) / 60, 2) +
            ":" +
            numberPad(menu.duration % 60, 2)}
        </td>
        <td>{menu.view}</td>
        <td>{category_list[menu.category]}</td>
      </tr>
    ));
    return (
      <>
        <div className="user_trashcan_table">
          <ul className="">
            <li>
              <input
                type="text"
                name="title"
                value={this.state.title}
                placeholder="Search"
                onChange={this.onChangeTitle}
              ></input>
              <button
                type="button"
                onClick={this.post_search.bind(this, this.state.title)}
              >
                <img src={ic_search_white}/>
              </button>
            </li>
            <li>
              <button type="button" onClick={this.post_recovery.bind(this)}>
                게시물 복구
              </button>
            </li>
          </ul>
          <div>
            <table className="table-library">
              <colgroup>
                <col width="5%" />
                <col width="5%" />
                <col width="25%" />
                <col width="10%" />
                <col width="5%" />
                <col width="50%" />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    {this.state.type === "list" && (
                      <>
                        <input
                          type="checkbox"
                          id="list_check_all"
                          name="all"
                          onClick={this.handleCheckAll.bind(this)}
                          checked={this.selectedVideo.length === this.state.posts.length}
                        />
                        <label for="list_check_all">
                          <span></span>
                        </label>
                      </>
                    )}
                  </th>
                  <th>번호</th>
                  <th>동영상</th>
                  <th>영상길이</th>
                  <th>조회수</th>
                  <th>카테고리</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {video_list.length !== 0 ? (
                  video_list
                ) : (
                  <tr>
                    <td colSpan="7" className="trashcan_no_item">
                      삭제하신 동영상이 존재하지 않습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
export default UserTrashVideo;
