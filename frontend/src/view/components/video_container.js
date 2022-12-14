import React, { Component } from "react";
import axios from "axios";
import Search from "./search.js";
import Pagination from "./pagination.js";
import { numberPad } from "./common";
import { getCookie } from "../contents/user/cookies.js";

class VideoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      post: [],
      posts: [],
      video_tag: [],
      check_video: [],
      update_video: {},
      current_page: 1,
      show_count: 10,
      page_count: 5,
      update_title: "",
      update_thumbnail: "",
      update_duration: "",
      checkAllCheck: false,
      update_platform: "",
      update_description: "",
      titleCheck: true,
      viewCheck: true,
      update_tag: "",
      update_category: "",
      searchChek: false,
      modalwriter: "",
      modaluploadtime: "",

      TransmissionOnS: false,
      TransmissionOffS: false,
      ConnectionOnS: false,
      ConnectionOffS: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    // this.videoUpdateHandleChange = this.videoUpdateHandleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.setPost = this.setPost.bind(this);
    this.videoUpdateOn = this.videoUpdateOn.bind(this);
    this.videoUpdateOff = this.videoUpdateOff.bind(this);
    this.OnTransmissionOnS = this.OnTransmissionOnS.bind(this);
    this.OffTransmissionOnS = this.OffTransmissionOnS.bind(this);
    this.OnConnectionOnS = this.OnConnectionOnS.bind(this);
    this.OffConnectionOffS = this.OffConnectionOffS.bind(this);
  }

  OnTransmissionOnS(chice) {
    this.setState({ TransmissionOnS: !chice });
    console.log(chice);
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
      if (this.state.ConnectionOnS && this.state.ConnectionOffS == false) {
        //?????? - ?????? ?????? ??????
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.ai_connection == 1;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }
      if (this.state.ConnectionOffS && this.state.ConnectionOnS == false) {
        //?????? - ????????? ?????? ??????
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.ai_connection == 0;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }
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
      if (this.state.ConnectionOnS && this.state.ConnectionOffS == false) {
        //?????? - ?????? ?????? ??????
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.ai_connection == 1;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }
      if (this.state.ConnectionOffS && this.state.ConnectionOnS == false) {
        //?????? - ????????? ?????? ??????
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.ai_connection == 0;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }

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
    console.log(chice);
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
      if (this.state.TransmissionOnS && this.state.TransmissionOffS == false) {
        //?????? - ?????? ?????? ??????
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.transmission_status == 1;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }
      if (this.state.TransmissionOffS && this.state.TransmissionOnS == false) {
        //?????? - ?????? ?????? ??????
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.transmission_status == 0;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }

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
      if (this.state.TransmissionOnS && this.state.TransmissionOffS == false) {
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.transmission_status == 1;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }
      if (this.state.TransmissionOffS && this.state.TransmissionOnS == false) {
        //?????? - ?????? ?????? ??????
        axios.get("/VideoApi", null).then((response) => {
          let arrays = response.data;
          let isvalid = function (arrays) {
            return arrays.transmission_status == 0;
          };
          var valids = arrays.filter(isvalid);
          console.log(valids);
          this.setState({ posts: valids });
        });
        return;
      }

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
  componentDidMount() {
    axios.get("/VideoApi", null).then((response) => {
      this.setState({
        posts: response.data,
      });
    });

    axios.get("/VideoTagApi", null).then((response) => {
      this.setState({
        video_tag: response.data,
      });
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });

    if(name == "update_tag") {
      const tags = value.split("#");
      const tagsLength = tags.length - 1;

      for(let i = 1; tagsLength >= i; i++) {
        if(tags[i].length > 4) {
          tags[i] = tags[i].slice(0, 4);
        }
      }

      const tagsJoin = tags.join('#');
      this.setState({[name] : tagsJoin});
      return;
    }
  }

  handleCheckAll = () => {
    const header = document.getElementsByName("check_box_all");
    const idx = this.state.post.map((post) => {
      return post.idx;
    });

    if (header[0].checked === true) {
      const set = new Set([...this.state.check_video, ...idx]);

      this.setState({
        check_video: [...set],
      });
    } else {
      const reduceVideo = this.state.check_video.filter((video) => {
        return !idx.includes(video);
      });

      this.setState({
        check_video: [...reduceVideo],
      });
    }
  };

  handleCheck(e, transmission_status) {
    if (transmission_status === 1) {
      const confirmResult = window.confirm(
        "????????? ?????? ???????????? ?????? ??? ????????????. ????????? ?????? ?????? ???????????????????"
      );

      if (!confirmResult) {
        return;
      }
    }
    const value = parseInt(e.target.value);

    if (this.state.type === "ai") {
      let index = this.state.check_video.indexOf(value);

      if (index >= 0) {
        this.state.check_video.splice(index, 1);
      } else {
        this.state.check_video = [value];
      }

      const post = this.state.posts.filter((data) => {
        return data.idx == value;
      })[0];

      this.props.setVideo(post);
    } else {
      let index = this.state.check_video.indexOf(value);

      if (index === -1) {
        this.state.check_video.push(value);
      } else {
        this.state.check_video.splice(index, 1);
      }
    }

    this.setState({
      check_video: [...this.state.check_video],
    });
  }

  async handleDelete(e) {
    const { value } = e.target;

    let check_video = this.state.posts[value];
    if (value) {
      check_video = value;
    }
    // console.log(check_video)
    axios
      .delete("/VideoApi", { params: { video_idx: check_video } })
      .then((response) => {
        alert("?????? ??????");
        window.location.reload(); //????????????
      });
  }

  sortAsTitle(arr) {
    const koreanRegex = /[???-??????-??????-???]/;
    const engRegex = /[a-zA-Z]/;
    const numRegex = /[0-9]/;
    let kor = [],
      eng = [],
      num = [],
      other = [];
    arr.forEach((element) => {
      let firstWord = element.title.charAt(0);
      // console.log(firstWord);
      if (koreanRegex.test(firstWord)) {
        kor.push(element);
      } else if (engRegex.test(firstWord)) {
        eng.push(element);
      } else if (numRegex.test(firstWord)) {
        num.push(element);
      } else {
        other.push(element);
      }
    });
    kor.sort(this.ascending);
    eng.sort((a, b) => {
      return a.title > b.title;
    });
    num.sort(this.ascending);
    other.sort((a, b) => {
      return a.title > b.title;
    });
    let result = kor.concat(eng, num, other);

    console.log(kor);
    console.log(eng);
    console.log(num);
    console.log(other);

    return result;
  }

  ascending(a, b) {
    let x = a.title.toLowerCase();
    let y = b.title.toLowerCase();
    return x < y ? -1 : x == y ? 0 : 1;
  }

  handleCheckVideoDelete = async () => {
    if (this.state.check_video.length > 0) {
      const checkVideo = this.state.check_video;

      checkVideo.forEach((videoIdx) => {
        axios
          .delete("/VideoApi", { params: { video_idx: videoIdx } })
          .then((response) => {});
      });

      const filterIdx = this.state.posts.filter((post) => {
        if (checkVideo.indexOf(post.idx) === -1) {
          return true;
        }
      });

      this.setState({
        posts: [...filterIdx],
        checkVideo: [],
      });
    }
  };

  handleUpdate() {
    let tags = this.state.update_tag.replace(/(\s*)/g, "");
    tags = tags.split("#");

    if (this.state.update_title == "") {
      return alert("????????? ??????????????????");
    } else if (tags.length === 1 && tags[0] !== "") {
      return alert("????????? #?????? ???????????? ?????????????????? \n ex)#??? #??????");
    } else if (this.state.update_category == "") {
      return alert("????????? ??????????????????");
    }
    tags.splice(0, 1);

    var update_video = {
      update_idx: this.state.update_video.idx,
      update_title: this.state.update_title,
      update_description: this.state.update_description,
      update_category: this.state.update_category,
      update_tag: tags,
    };
    axios.put("/VideoApi", null, { params: update_video }).then((response) => {
      alert("?????? ??????");
      window.location.reload(); //????????????
    });
  }

  async videoUpdateOn(e) {
    const { value } = e.target;

    let update_video = this.state.posts.filter((data) => {
      return data.idx == value;
    });

    await this.setState({
      update_video: update_video[0],
    });

    let tags = [];
    this.state.video_tag.filter((data) => {
      if (data.fk_video_idx == value) {
        tags.push(data.tag);
      }
    });

    let tag = "";
    let hash = "#";
    for (let i in tags) {
      if (i == 1) {
        hash = " #";
      }
      tag = tag + hash + tags[i];
    }

    if (this.state.update_video) {
      this.setState({
        update_title: this.state.update_video.title,
        update_thumbnail: this.state.update_video.thumbnail,
        update_duration: this.state.update_video.duration,
        update_platform: this.state.update_video.platform,
        update_description: this.state.update_video.description,
        update_tag: tag,
        update_category: this.state.update_video.category,
      });
    }
  }

  videoUpdateOff() {
    this.setState({
      update_video: {},
      update_title: "",
      update_thumbnail: "",
      update_duration: "",
      update_platform: "",
      update_description: "",
      // update_tag: '',
      update_category: "",
    });
  }

  onChangeVideoList(data, page) {
    this.setState({
      post: data.slice((page - 1) * 10, page * 10 - 1),
      posts: data,
      current_page: 1,
      show_count: this.state.show_count,
      page_count: this.state.page_count,
    });
    this.setPost.bind(this, 1);
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
      post: this.state.posts.slice((page - 1) * 10, page * 10),
      current_page: page,
    });
  }

  sortViewVideo = () => {
    const videos = this.state.posts;

    if (this.state.viewCheck) {
      // ????????? ???????????? ??????
      const sortVideos = videos.sort((a, b) => {
        return b.view - a.view;
      });

      this.setState({
        posts: [...sortVideos],
      });
    } else {
      // ????????? ???????????? ??????
      const sortVideos = videos.sort((a, b) => {
        return a.view - b.view;
      });

      this.setState({
        posts: [...sortVideos],
      });
    }

    this.setState({
      viewCheck: !this.state.viewCheck,
      titleCheck: true,
    });
  };

  sortVideo = () => {
    const videos = this.state.posts;

    if (this.state.titleCheck) {
      // ???????????? (?????? > ?????? > ?????? > ????????????) ??????
      const sortVideos = this.sortAsTitle(videos);

      this.setState({
        posts: [...sortVideos],
      });
    } else {
      // ????????? ??????
      const sortVideos = videos.sort((a, b) => {
        return new Date(b.upload_time) - new Date(a.upload_time);
      });

      this.setState({
        posts: [...sortVideos],
      });
    }

    this.setState({
      titleCheck: !this.state.titleCheck,
      viewCheck: true,
    });
  };

  setSearchCheck = (value) => {
    this.setState({
      searchChek: value,
    });
  };

  searchedResult = () => {
    const isSearched = this.state.searchChek;
    const checkedVideo = this.state.check_video.length;
    const searchedVideo = this.state.posts.length;

    if (isSearched) {
      // (?????? ????????? ??????) || (???????????? ?????? ????????? ????????? ????????? ??????)
      if (searchedVideo == 0 || (searchedVideo > 0 && checkedVideo <= 0)) {
        return `${searchedVideo}?????? ?????? ???????????????`;
      } else {
        return `?????? ${checkedVideo}???`;
      }
    } else {
      if (checkedVideo > 0) {
        return `?????? ${checkedVideo}???`;
      } else {
        return `?????? ${searchedVideo}???`;
      }
    }
  };
  //table ????????? ?????? ??? modal??? ????????? ??????
  async videoDetailView(idx) {
    let update_video = this.state.posts.filter((data) => {
      return data.idx == idx;
    });
    console.log(this.state.post);
    await this.setState({
      update_video: update_video[0],
    });
    console.log(update_video[0]);
    let tags = [];
    this.state.video_tag.filter((data) => {
      if (data.fk_video_idx == idx) {
        tags.push(data.tag);
      }
    });

    let tag = "";
    let hash = "#";
    for (let i in tags) {
      if (i == 1) {
        hash = " #";
      }
      tag = tag + hash + tags[i];
    }
    if (this.state.update_video) {
      this.setState({
        update_title: this.state.update_video.title,
        update_thumbnail: this.state.update_video.thumbnail,
        update_duration: this.state.update_video.duration,
        update_platform: this.state.update_video.platform,
        update_description: this.state.update_video.description,
        update_tag: tag,
        update_category: this.state.update_video.category,
      });
    }
    if (this.state.update_video.platform != "?????? ?????????") {
      let YouTubeUrl = update_video[0].url;
      let NewYouTubeUrl = YouTubeUrl.split("=");
      this.setState({ YoutubeURL: NewYouTubeUrl[1] });
    }
    //????????? ?????? ?????? ??? ????????? ?????? api ??????
    axios
      .get("/VideoCounterApi", { params: { videoidx: idx } })
      .then((response) => {
        const week = new Array("???", "???", "???", "???", "???", "???", "???");

        let testy =
          String(response.data.time).substring(0, 4) +
          "-" +
          String(response.data.time).substring(5, 7) +
          "-" +
          String(response.data.time).substring(8, 10) +
          "-" +
          week[new Date(response.data.time).getDay()] +
          " " +
          String(response.data.time).substring(11, 13) +
          ":" +
          String(response.data.time).substring(14, 16) +
          ":" +
          String(response.data.time).substring(17, 19);
        this.setState({
          modalwriter: response.data.name,
          modaluploadtime: testy,
        });
      });
  }
  render() {
    const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
    const ai_connection = ["?????????", "??????"];
    const transmission_status = ["??????", "??????"];
    const category_list = [
      "??????",
      "??????",
      "?????????/??????",
      "?????????",
      "??????",
      "???????????????",
      "??????",
    ];
    const week = new Array("???", "???", "???", "???", "???", "???", "???");
    const boshow_token = getCookie("boshow_token");
    const user_idx = this.parseJwt(boshow_token)["idx"];

    const show_count = 10;
    const page_count = 5;

    const update_video = this.state.update_video;
    const isSearched = this.state.searchChek;
    const checkedVideo = this.state.check_video.length;
    const searchedVideo = this.state.posts.length;

    const video_list = this.state.post.map((menu, key) => (
      <tr
        key={key}
        className={
          this.state.check_video.indexOf(menu.idx) !== -1 ? "selected" : ""
        }
      >
        <td>
          <input
            type="checkbox"
            id={"list" + menu.idx}
            name="check_box"
            value={menu.idx}
            onClick={(e) => this.handleCheck(e, menu.transmission_status)}
            checked={this.state.check_video.indexOf(menu.idx) !== -1}
          />
          <label for={"list" + menu.idx}>
            <span></span>
          </label>
        </td>
        <td>{menu.idx}</td>
        <td>
          {menu.platform === "?????? ?????????" ? (
            <img
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                this.videoDetailView(menu.idx);
              }}
              src={image_path + "videos/" + String(menu.idx) + "_thumbnail.jpg"}
              alt=""
              className="video_list_image"
            />
          ) : (
            <img
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                this.videoDetailView(menu.idx);
              }}
              src={menu.thumbnail}
              alt=""
              className="video_list_image"
            />
          )}
          <span className="list_description">
            <p>{menu.title}</p>
            <p>{menu.description}</p>
          </span>
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
        <td className="video_list_btn">
          {this.state.type === "list" ? (
            <button
              type="button"
              value={menu.idx}
              onClick={(e) => {
                this.videoDetailView(menu.idx);
              }}
            >
              ??????
            </button>
          ) : null}
          {this.state.type === "list" && menu.fk_user_idx == user_idx ? (
            <button type="button" value={menu.idx} onClick={this.handleDelete}>
              ??????
            </button>
          ) : null}
        </td>
      </tr>
    ));

    //const update_video = this.state.update_video;

    return (
      <>
        <Search
          searchMode="video_list"
          onSearchValue={this.onChangeVideoList.bind(this)}
          isSearched={this.setSearchCheck}
          OnTransmissionOnSsss={this.OnTransmissionOnS.bind(this)}
          OffTransmissionOnSs={this.OffTransmissionOnS}
          OnConnectionOnSs={this.OnConnectionOnS.bind(this)}
          OffConnectionOffSs={this.OffConnectionOffS.bind(this)}
        />
        <div className="video_list" style={{ zIndex: "-99" }}>
          <div>
            <h1>????????? ?????? ??? ????????????</h1>
            <span>{this.searchedResult()}</span>
            {this.state.type === "list" && (
              <button
                onClick={this.handleCheckVideoDelete}
                disabled={this.state.check_video.length <= 0 && "disabled"}
              >
                ????????????
              </button>
            )}
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
              <col width="100px" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  {this.state.type === "list" && (
                    <>
                      <input
                        type="checkbox"
                        id="list_check_all"
                        name="check_box_all"
                        onClick={this.handleCheckAll}
                        checked={
                          this.state.post.filter((x) =>
                            this.state.check_video.includes(x.idx)
                          ).length >= this.state.post.length
                        }
                      />
                      <label for="list_check_all">
                        <span></span>
                      </label>
                    </>
                  )}
                </th>
                <th>??????</th>
                <th onClick={this.sortVideo} style={{ cursor: "pointer" }}>
                  {this.state.titleCheck ? "????????? ???" : "????????? ???"}
                </th>
                <th onClick={this.sortViewVideo} style={{ cursor: "pointer" }}>
                  {this.state.viewCheck ? "????????? ???" : "????????? ???"}
                </th>
                <th>????????????</th>
                <th>??????</th>
                <th>??????</th>
                <th>?????????</th>
                <th>AI????????????</th>
                <th>????????????</th>
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
          {this.props.children}
        </div>
        {this.state.update_video.idx ? (
          <div className="video_update">
            <h1>
              ????????? ??????
              <button type="button" onClick={this.videoUpdateOff}>
                X
              </button>
            </h1>
            <ul>
              <li>
                {this.state.update_video.platform === "?????? ?????????" ? (
                  <video
                    controls
                    loop
                    width="271px"
                    src={
                      image_path +
                      "videos/" +
                      String(this.state.update_video.idx) +
                      ".mp4"
                    }
                    alt=""
                    className="video_list_image"
                    autoplay="autoplay"
                  />
                ) : (
                  <iframe
                    width="271px"
                    src={
                      "https://www.youtube.com/embed/" +
                      String(this.state.YoutubeURL) +
                      "?autoplay=1&loop=1"
                    }
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                )}
              </li>
              <div style={{ display: "flex" }}>
                <div className="VideoModal" style={{ width: "70px" }}>
                  <li
                    style={{
                      color: "#a5a5a5",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    ??????
                  </li>
                  <li
                    style={{
                      color: "var(--black-two)",
                      lineHeight: "1.7",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      height: "15px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    {numberPad(this.state.update_duration / 3600, 2) +
                      ":" +
                      numberPad((this.state.update_duration % 3600) / 60, 2) +
                      ":" +
                      numberPad(this.state.update_duration % 60, 2)}
                  </li>
                  <li
                    style={{
                      color: "#a5a5a5",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    ?????????
                  </li>
                  <li
                    style={{
                      color: "var(--black-two)",
                      lineHeight: "1.7",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      height: "15px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--black-two)",
                        lineHeight: "1.7",
                        letterSpacing: "-0.12px",
                        fontSize: "10px",
                        height: "15px",
                        fontFamily: "NotoSansCJKKR",
                      }}
                    >
                      {this.state.update_platform}
                    </span>
                  </li>
                </div>

                <div className="VideoModal">
                  <li
                    style={{
                      color: "#a5a5a5",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    ??? ???
                  </li>
                  <li
                    style={{
                      color: "var(--black-two)",
                      lineHeight: "1.7",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      height: "15px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    {this.state.modaluploadtime}
                  </li>
                  <li
                    style={{
                      color: "#a5a5a5",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    ?????????
                  </li>
                  <li
                    style={{
                      color: "var(--black-two)",
                      lineHeight: "1.7",
                      letterSpacing: "-0.12px",
                      fontSize: "10px",
                      height: "15px",
                      fontFamily: "NotoSansCJKKR",
                    }}
                  >
                    {this.state.modalwriter}
                  </li>
                </div>
              </div>
            </ul>
            <ul>
              <li>??????</li>
              <li>
                <input
                  type="text"
                  name="update_title"
                  value={this.state.update_title}
                  onChange={this.handleChange}
                />
              </li>
              <li>??????</li>
              <li>
                <textarea
                  className="video_update_description"
                  name="update_description"
                  onChange={this.handleChange}
                  value={this.state.update_description}
                  maxLength={200}
                  placeholder="?????? ?????? ?????? 200??? ????????? ??????????????? ?????????, ????????? ????????? ????????? ????????? ????????? ???????????????."
                />
              </li>
              <li>??????</li>
              <li>
                <input
                  type="text"
                  name="update_tag"
                  onChange={this.handleChange}
                  value={this.state.update_tag}
                  placeholder="#?????? #??????"
                />
              </li>
              <li>??????</li>
              <li>
                <select
                  name="update_category"
                  onChange={this.handleChange}
                  value={this.state.update_category}
                >
                  <option value="" disabled selected hidden>
                    ???????????? ??????
                  </option>
                  <option value="1">??????</option>
                  <option value="2">?????????/??????</option>
                  <option value="3">?????????</option>
                  <option value="4">??????</option>
                  <option value="5">???????????????</option>
                  <option value="6">??????</option>
                  <option value="0">??????</option>
                </select>
              </li>
              <button type="button" onClick={this.handleUpdate}>
                ??????
              </button>
            </ul>
          </div>
        ) : null}
      </>
    );
  }
}

export default VideoContainer;
