import React, { Component, useRef } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import VideoCheckModal from "./video_check_modal.js";
import Search from "../../components/search.js";
import VideoPlayerAdb from "./video_player_adb.js";
import Pagination from "../../components/pagination.js";
import Youtube from "react-youtube";
import { numberPad } from "../../components/common";
import VideosModal from "./modal/video_modal";
import axios from "axios";
import { getCookie } from "../user/cookies.js";
// import { Link } from "react-router-dom";

class OPVideoCheck extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      video: [],
      posts: [],
      post: [],
      current_page: 1,
      link: "",
      selectedAdbDis: "selected",
      selectedComDis: "",
      selectedVideo: "",
      adVideo: [],
      check_video: [],
      tier: 1,
      searchChek: false,

      TransmissionOnS: false,
      TransmissionOffS: false,
      ConnectionOnS: false,
      ConnectionOffS: false,
      openmodal: false,
      modaldetail: {},
      videotag: [],
    };
    const interval = [];
    this.videoList.bind(this);
    this.setPost = this.setPost.bind(this);
    this.videoList();
    this.checkAdVideo();
    this.OnTransmissionOnS = this.OnTransmissionOnS.bind(this);
    this.OffTransmissionOnS = this.OffTransmissionOnS.bind(this);
    this.OnConnectionOnS = this.OnConnectionOnS.bind(this);
    this.OffConnectionOffS = this.OffConnectionOffS.bind(this);
    this.closemodals = this.closemodal.bind(this);
  }
  setSearchCheck = (value) => {
    this.setState({
      searchChek: value,
    });
  };

  closemodal = () => {
    this.setState({
      openmodal: false,
    });
  };
  OnTransmissionOnS(chice) {
    this.setState({ TransmissionOnS: !chice });
    if (!this.state.TransmissionOnS) {
      if (this.state.TransmissionOnS != this.state.TransmissionOffS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      let isvalid = function (newarrayss) {
        return newarrayss.transmission_status == 1;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    } else {
      if (!this.state.TransmissionOffS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      console.log(newarrayss);
      let isvalid = function (newarrayss) {
        return newarrayss.transmission_status == 0;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    }
  }
  OffTransmissionOnS(chice) {
    this.setState({ TransmissionOffS: !chice });
    if (!this.state.TransmissionOffS) {
      if (this.state.TransmissionOnS != this.state.TransmissionOffS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      let isvalid = function (newarrayss) {
        return newarrayss.transmission_status == 0;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    } else {
      if (!this.state.TransmissionOnS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      let isvalid = function (newarrayss) {
        return newarrayss.transmission_status == 1;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    }
  }

  OnConnectionOnS(chice) {
    this.setState({ ConnectionOnS: !chice });
    if (!this.state.ConnectionOnS) {
      if (this.state.ConnectionOnS != this.state.ConnectionOffS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      let isvalid = function (newarrayss) {
        return newarrayss.ai_connection == 1;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    } else {
      if (!this.state.ConnectionOffS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      let isvalid = function (newarrayss) {
        return newarrayss.ai_connection == 0;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    }
  }
  OffConnectionOffS(chice) {
    this.setState({ ConnectionOffS: !chice });
    if (!this.state.ConnectionOffS) {
      if (this.state.ConnectionOnS != this.state.ConnectionOffS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      let isvalid = function (newarrayss) {
        return newarrayss.ai_connection == 0;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    } else {
      if (!this.state.ConnectionOnS) {
        axios.get("/VideoApi", null).then((response) => {
          this.setState({
            posts: response.data,
          });
        });
        return;
      }
      let newarrayss = [...this.state.posts];
      let isvalid = function (newarrayss) {
        return newarrayss.ai_connection == 1;
      };
      var valids = newarrayss.filter(isvalid);
      this.setState({ posts: valids });
    }
  }

  videoList() {
    try {
      axios
        .get("/VideoApi", null, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          this.setState({
            posts: response.data,
          });
          axios.get("/VideoTagApi").then((response) => {
            this.setState({ videotag: response.data });
          });
        }) // SUCCESS
        .catch((response) => {
          console.log(response);
        }); // ERROR
    } catch (e) {
      console.log(e);
    }
    axios
      .get("/FindUserDetails", {
        params: { boshow_token: getCookie("boshow_token") },
      })
      .then((response) => {
        this.setState({ tier: response.data[0].tier });
      });
  }

  checkAdVideo() {
    axios
      .get("/AdbMatchVideoApi", null, {
        headers: { "content-type": "application/json" },
      })
      .then((response) => {
        this.setState({
          adVideo: response.data,
        });
      })
      .catch((res) => {
        console.log(res);
      });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
    clearInterval(this.timer);
  };

  async videoSelect(video, e) {
    // let link = video.url
    // this.params = {
    //     video_idx: video.idx,
    //     item_idx: 0
    // }
    // await axios.get('/ItemDetail', {params: this.params})
    // .then(response => {

    this.setState({
      video: video,
      modalOpen: true,
      link: "",
      selectedAdb: true,
      selectedCom: false,
      youtube_id: video.url.split("?v=")[1],
      selectedVideo:
        "//localhost:3000/Boshow_player?video_idx=" + String(video.idx),
    });
    // })

    // if(video.platform === "SBS"){
    //     // 동영상 검수 팝업 video 가져오기
    //     await axios.get('/MakeSbsToken', null, {headers: {'content-type': 'application/json'}})
    //     .then( response => {
    //         if(response.status == 200){
    //             console.log(response.data.token)
    //             this.setState({
    //                 token: response.data.token
    //             })
    //         }
    //     })
    //     let video_id = this.state.video.url.slice(-11);
    //     var playtime;
    //     let SBS_video_id = video_id
    //     await axios.get('http://apis.sbs.co.kr/play-api/ad-admin/1.0/boshow/media/' + SBS_video_id + "?pnw-token=" + this.state.token, {headers: {'content-type': 'application/json'}})
    //         .then(function (response) {
    //         if(response.status == 200){
    //                 playtime = response.data.playtime
    //                 link = response.data.mediaurl
    //         }else if(response.status == 404){
    //             alert("서버와 연결이 되지 않습니다.");
    //         }else if(response.status == 500){
    //             alert("영상이 존재하지 않습니다.");
    //         }
    //     });
    //     await this.setState({
    //         link: link
    //     })
    // }else if(video.platform === "직접 업로드"){
    //     await this.setState({
    //         link: `${process.env.REACT_APP_BACKEND_HOST}static/videos/`+String(video.idx)+"."+String(video.url)
    //     })
    // }else{
    //     await this.setState({
    //         link: "https://www.youtube.com/embed/"+video.url.split('?v=')[1]
    //     })
    // }
  }

  onChangeVideoOpList(data, page) {
    this.setState({
      post: data.slice((page - 1) * 10, page * 10 - 1),
      posts: data,
      current_page: 1,
      show_count: this.state.show_count,
      page_count: this.state.page_count,
    });
    this.setPost.bind(this, 1);
  }

  onTransmission(e) {
    if (this.state.tier < 2) {
      alert("스태프 등급은 송출할 수 없습니다.");
      return;
    }

    e.preventDefault();
    var TransVideo = window.confirm("영상을 송출하시겠습니까?");
    if (TransVideo) {
      this.transVideo = {
        mode: "transmission",
        token: getCookie("boshow_token"),
        idx: this.state.video.idx,
        transmission: 1,
      };
      axios
        .put("/VideoApi", null, { params: this.transVideo })
        .then((response) => {
          alert("영상 송출이 완료 되었습니다.");
          window.location.reload();
        });
    }
  }

  setPost(page) {
    this.setState({
      post: this.state.posts.slice((page - 1) * 10, page * 10 - 1),
      current_page: page,
    });
  }

  onChangeVideoType(adb, com, e) {
    e.preventDefault();
    this.setState({
      selectedAdbDis: adb,
      selectedComDis: com,
    });
    if (adb === "selected") {
      this.setState({
        selectedVideo:
          `${process.env.REACT_APP_BACKEND_HOST3000}Boshow_player?video_idx=` +
          String(this.state.video.idx),
      });
    } else {
      this.setState({
        selectedVideo:
          `${process.env.REACT_APP_BACKEND_HOST3000}Boshow_player?video_idx=` +
          String(this.state.video.idx),
      });
    }
  }

  handleCheck = (e) => {
    const value = parseInt(e.target.value);
    let check_video = [...this.state.check_video];
    let index = check_video.indexOf(value);

    if (index === -1) {
      check_video.push(value);
    } else {
      check_video.splice(index, 1);
    }

    this.setState({
      check_video: check_video,
    });
  };

  // PlayVideo(e){
  //     console.log(e.target.getCurrentTime()
  //     const timer = setInterval(()=>console.log(e.target.getCurrentTime()), 1000)
  //     clearInterval(timer)
  // }

  render() {
    const opts = {
      height: "360",
      width: "640",
    };
    const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
    const show_count = 10;
    const page_count = 5;
    const category_list = [
      "기타",
      "예능",
      "스포츠/취미",
      "드라마",
      "고양",
      "애니메이션",
      "키즈",
    ];
    const week = new Array("일", "월", "화", "수", "목", "금", "토");
    const adCheck = (menuIdx) => {
      const filterAdVideo = this.state.adVideo.filter((ad) => {
        return ad.fk_video_idx === menuIdx;
      });

      if (filterAdVideo.length > 0) {
        return true;
      } else {
        return false;
      }
    };

    const video_list = this.state.post.map((menu) => (
      <tr
        key={menu.idx}
        className={
          this.state.check_video.indexOf(menu.idx) !== -1 ? "selected" : ""
        }
      >
        <th>
          <input
            type="checkbox"
            id={"list" + menu.idx}
            name="idx"
            value={menu.idx}
            onClick={this.handleCheck}
            checked={this.state.check_video.indexOf(menu.idx) !== -1}
            style={{ display: "none" }}
          />
          <label
            for={"list" + menu.idx}
            style={{
              display: "inline-block",
              width: "17px",
              height: "17px",
              backgroundColor: "#fff",
              cursor: "pointer",
              borderRadius: "1px",
              border: "1px solid",
              boxShadow: "1px 1px grey inset",
              position: "relative",
            }}
          >
            <span></span>
          </label>
        </th>
        <th
          onClick={() => {
            console.log(this.state.post);
          }}
        >
          {menu.idx}
        </th>
        <td>
          <button>
            {menu.platform === "직접 업로드" ? (
              <img
                onClick={() => {
                  this.setState({ openmodal: true, modaldetail: menu });
                }}
                src={
                  image_path + "videos/" + String(menu.idx) + "_thumbnail.jpg"
                }
                alt=""
                className="video_list_image"
              />
            ) : (
              <img
                src={menu.thumbnail}
                onClick={() => {
                  this.setState({ openmodal: true, modaldetail: menu });
                }}
                alt=""
                className="video_list_image"
              />
            )}
          </button>
          {menu.title}
          <p className="video_list_explanation">{menu.video_explanation}</p>
        </td>
        <th>{menu.view}</th>
        <th>
          {numberPad(menu.duration / 3600, 2) +
            ":" +
            numberPad((menu.duration % 3600) / 60, 2) +
            ":" +
            numberPad(menu.duration % 60, 2)}
        </th>
        <th>{category_list[menu.category]}</th>
        <th>
          <p>
            {new Date(menu.upload_time).getFullYear() +
              "-" +
              String(new Date(menu.upload_time).getMonth()).padStart(2, "0") +
              "-" +
              String(new Date(menu.upload_time).getDate()).padStart(2, "0") +
              "-" +
              week[new Date(menu.upload_time).getDay()] +
              " "}
          </p>
          <p>
            {String(new Date(menu.upload_time).getHours()) +
              ":" +
              String(new Date(menu.upload_time).getMinutes()) +
              ":" +
              String(new Date(menu.upload_time).getSeconds())}
          </p>
        </th>
        <th>{menu.user_name}</th>
        <th>{menu.ai_connection == 1 ? "연결" : "미연결"}</th>
        <th>{menu.transmission_status !== 0 ? "완료" : "대기"}</th>
        <th>{adCheck(menu.idx) ? "O" : "X"}</th>
        {menu.transmission_status !== 1 ? (
          <td>
            <button type="button" onClick={this.videoSelect.bind(this, menu)}>
              송출
            </button>
          </td>
        ) : (
          <td>
            <button type="button" disabled>
              송출 완료
            </button>
          </td>
        )}
      </tr>
    ));
    return (
      <>
        <Header mode="operation"></Header>
        <Managenav
          mode="operation"
          menu="동영상 검수"
          sub="동영상 검수"
        ></Managenav>

        <section className="content make_ai">
          <h1 className="title">동영상 검수</h1>
          <div>
            <Search
              searchMode="video_list"
              onSearchValue={this.onChangeVideoOpList.bind(this)}
              isSearched={this.setSearchCheck}
              OnTransmissionOnSsss={this.OnTransmissionOnS.bind(this)}
              OffTransmissionOnSs={this.OffTransmissionOnS}
              OnConnectionOnSs={this.OnConnectionOnS.bind(this)}
              OffConnectionOffSs={this.OffConnectionOffS.bind(this)}
            />
            <div className="make_ai_video_select video_list">
              <div>
                <h1>
                  동영상 목록 및 상세검색
                  <span className="make_ai_video_search_guide">
                    전체 {this.state.posts.length}개
                  </span>
                </h1>
                {/* <button type="button" onClick={this.props.level_next}>다음</button> */}
                {/* <span className="video_list_search_guide">조회순 ▼</span> */}
              </div>
              <table className="make_ai_video_list">
                <colgroup>
                  <col width="40px" />
                  <col width="" />
                  <col width="" />
                  <col width="" />
                  <col width="" />
                  <col width="" />
                  <col width="" />
                  <col width="" />
                  <col width="" />
                  <col width="" />
                </colgroup>
                <thead>
                  <tr>
                    <th></th>
                    <th>번호</th>
                    <th>동영상</th>
                    <th>조회수</th>
                    <th>영상길이</th>
                    <th>카테고리</th>
                    <th>날짜 ↑</th>
                    <th>등록자</th>
                    <th>AI 연결여부</th>
                    <th>송출상태</th>
                    <th>광고여부</th>
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
                  current_page={this.state.current_page}
                  setPost={this.setPost}
                />
              )}
            </div>
          </div>
        </section>
        <VideoCheckModal
          open={this.state.modalOpen}
          close={this.closeModal}
          title="Create a chat room"
        >
          <div className="videocheckmodal">
            <main> {this.props.children} </main>
            <div>
              <div className="header">
                동영상 검수
                <button type="button" onClick={this.closeModal}>
                  X
                </button>
              </div>
              <div className="btn_line">
                {/* <button type="button" className={this.state.selectedAdbDis} onClick={this.onChangeVideoType.bind(this, "selected", "")}>광고</button> */}
                {/* <button type="button" className={this.state.selectedComDis} onClick={this.onChangeVideoType.bind(this, "", "selected")}>커머스</button> */}
              </div>
              <div className="preview">
                <p>
                  미리보기
                  <span>영상 송출 전 등록한 광고를 확인해보세요.</span>
                </p>
                {/* <img src={`${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/1_1.png`} className="advertise_type_a"></img> */}
                {/* <VideoPlayerAdb video={this.state.video} itemDetail={this.state.itemDetail}></VideoPlayerAdb> */}
                <iframe
                  className={
                    this.state.selectedAdbDis === "selected" ? "active" : "hide"
                  }
                  src={this.state.selectedVideo}
                  width="735"
                  height="432"
                ></iframe>
                {/* <iframe className={this.state.selectedComDis==="selected"?"active":"hide"} src={`${process.env.REACT_APP_BACKEND_HOST3000}Boshow_player?video_idx=`+String(this.state.video.idx)} width="735" height="432"></iframe> */}
                {/* <Youtube videoId={this.state.youtube_id} opts={opts}></Youtube> */}
                {/* <iframe width="737" height="368.5" src={this.state.link}></iframe> */}

                <button type="button" onClick={this.onTransmission.bind(this)}>
                  송출하기
                </button>
              </div>
            </div>
          </div>
        </VideoCheckModal>
        {this.state.openmodal === true ? (
          <div
            style={{
              position: "fixed",
              height: "100%",
              right: "0",
              border: "1px solid #c3c3c3",
              width: "339px",
              top: "70px",
              backgroundColor: "white",
            }}
          >
            <VideosModal
              videodetail={this.state.modaldetail}
              closemodal={this.closemodals}
              videotag={this.state.videotag}
            />
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
export default OPVideoCheck;
