import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";

class VideoList extends Component {
  state = {
    posts: [],
  };

  async componentDidMount() {
    axios.get("/VideoApi", null).then((response) => {
      if (response.status == 200) {
        this.setState({
          posts: response.data,
        });
      }
    });
  }

  render() {
    const ai_connection = ["미연결", "연결"];
    const category_list = [
      "기타",
      "예능",
      "스포츠/취미",
      "드라마",
      "고양",
      "애니메이션",
      "키즈",
    ];
    const video_list = this.state.posts.map((menu) => (
      <tr key={menu.idx}>
        <td>{menu.idx}</td>
        <td>
          <img
            src="https://img.youtube.com/vi/{menu.video_url.substr(32, 11)}/hqdefault.jpg"
            alt=""
            className="video_list_image"
          ></img>
        </td>
        <td>
          {menu.title}
          <p className="video_list_explanation ng-binding">
            {menu.video_explanation}
          </p>
        </td>
        <td>
          {parseInt(menu.duration / 60) + ":" + parseInt(menu.duration % 60)}
        </td>
        <td>{menu.view + "회"}</td>
        <td>{category_list[menu.category]}</td>
        <td>{menu.fk_user_idx}</td>
        <td>{ai_connection[menu.ai_connection]}</td>
        <td>
          {new Date(menu.upload_time).getFullYear() +
            "/" +
            String(new Date(menu.upload_time).getMonth()).padStart(2, "0") +
            "/" +
            String(new Date(menu.upload_time).getDate()).padStart(2, "0")}
        </td>
        {/* <td>수정/삭제</td> */}
      </tr>
    ));
    return (
      <>
        <Header mode="editing"></Header>
        <Managenav
          mode="editing"
          menu="동영상 관리"
          sub="동영상 관리"
        ></Managenav>
        <section className="content">
          <h1 className="title">동영상 관리</h1>
          <div className="video_list">
            <div>
              <span>전체 30개</span>
              <span className="video_list_search">
                <input type="text" placeholder="Search" />
                <button type="button">
                  <img src="../images/common/icons/ic-search.png" alt="" />
                </button>
              </span>
              <span className="video_list_search_guide">조회순 ▼</span>
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
                  <th>동영상</th>
                  <th></th>
                  <th>영상길이</th>
                  <th>조회수</th>
                  <th>카테고리</th>
                  <th>등록자</th>
                  <th>AI 연결여부</th>
                  <th>날짜 ↑</th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>{video_list}</tbody>
            </table>
          </div>
        </section>
      </>
    );
  }
}

export default VideoList;
