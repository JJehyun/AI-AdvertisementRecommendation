import React, { Component, useRef } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import ReactPlayer from "react-player";
import { CupertinoPane, CupertinoSettings } from "cupertino-pane";
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";

import AdbTypeA from "../../components/adb_type_a.js";
import AdbTypeB from "../../components/adb_type_b.js";
import AdbTypeC from "../../components/adb_type_c.js";
import AdbTypeD from "../../components/adb_type_d.js";

import ic_close from "../../images/Boshow_player/ic_close.png";
import ic_video_pip from "../../images/Boshow_player/ic_video_pip.png";
import ic_video_start from "../../images/Boshow_player/ic_video_start.png";
import ic_video_pause from "../../images/Boshow_player/ic_video_pause.png";
import ic_back_10 from "../../images/Boshow_player/ic_back_10.png";
import ic_next_10 from "../../images/Boshow_player/ic_next_10.png";
// import ic_brightness from'../../images/Boshow_player/ic_brightness.png';
// import ic_sound from'../../images/Boshow_player/ic_sound.png';
// import ic_mute from'../../images/Boshow_player/ic_mute.png';
import ic_boshow_on from "../../images/Boshow_player/ic_boshow_on.png";
// import ic_boshow_off from'../../images/Boshow_player/ic_boshow_off.png';
import ic_fullscreen from "../../images/Boshow_player/ic_fullScreen.png";
import ic_land_fullscreen from "../../images/Boshow_player/landShow.png";
import ic_video_landscape from "../../images/Boshow_player/ic_video_landscape.png";
import Loading from "../../images/Boshow_player/Loading.gif";
import Boshow_Loading from "../../images/Boshow_player/Boshow_Loading.gif";
// import no_img from '../../images/common/no_item.png';

// import { Link } from "react-router-dom";

class BoshowPlayer extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props, context) {
    super(props, context);
    const { cookies } = props;
    this.state = {
      loading: true,
      link: "",
      platform: "",
      control: false,
      paused: false,
      // muted: false,
      boshow: false,
      length: null,
      formattedLength: null,
      currentTime: cookies.get("currentTime") || null,
      formattedTime: null,
      isItemExist: false,
      isAdbOn: false,
      isIOS:
        (/iPad|iPhone|iPod/.test(navigator.platform) ||
          (navigator.platform === "MacIntel" &&
            navigator.maxTouchPoints > 1)) &&
        !window.MSStream,
      isChrome: window.navigator.userAgent.includes("Chrome"),
      isSamsungBrowser: window.navigator.userAgent.includes("SamsungBrowser"),
      // volume: 0.0,
      videoTitle: "",
      item_draw: [],
      adb_a_item: {},
      adb_b_item: {},
      adb_c_list: [],
      adb_d_list: [],
      a: false,
      b: false,
      c: false,
      d: false,
      nowOrientation: 0,
      time_range_touched: false,
      isAdbOnOff: true,
      bounce: true,
      videoMaxTime: 0,
      adbTouching: false,
      removeStack: 0,
      videoAdbMatching: [],
      videoAdbs: [],
    };
    this.openAdb = this.openAdb.bind(this);
    this.urlSet = this.urlSet.bind(this);
    this.handleAdbData = this.handleAdbData.bind(this);
    this.screenControl = this.screenControl.bind(this);
    this.CupertinoPaneSet = this.CupertinoPaneSet.bind(this);
    this.setupCupertinoPane = this.setupCupertinoPane.bind(this);
    this.adb_a_close = this.adb_a_close.bind(this);
  }

  async urlSet() {
    var video_id,
      video_idx,
      position,
      link,
      playtime,
      length,
      platform,
      formattedLength,
      title,
      itemDetail,
      videoAdbMatching,
      videoAdbs,
      videoItems;
    const search = this.props.location.search;
    const params = new URLSearchParams(search);

    const video_path = `${process.env.REACT_APP_BACKEND_HOST}static/videos/`;

    video_id = params.get("video_id");
    video_idx = params.get("video_idx");
    position = params.get("position");

    if (video_id != "" && video_id != null) {
      let token = "";
      await axios
        .get(`http:${process.env.REACT_APP_BACKEND_HOST}api/MakeSbsToken`, null, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          if (response.status == 200) {
            token = response.data.token;
          }
        });
      let SBS_video_id = video_id;
      await axios
        .get(
          "http://apis.sbs.co.kr/play-api/ad-admin/1.0/boshow/media/" +
            SBS_video_id +
            "?pnw-token=" +
            token,
          {
            headers: { "content-type": "application/json" },
          }
        )
        .then(function (response) {
          if (response.status == 200) {
            playtime = response.data.playtime;
            length = response.data.playtime;
            link = response.data.mediaurl;
          } else if (response.status == 404) {
            alert("서버와 연결이 되지 않습니다.");
          } else if (response.status == 500) {
            alert("영상이 존재하지 않습니다.");
          }
        });
      this.VideoTitleParams = {
        video_id: SBS_video_id,
      };
      await axios
        .get("/VideoTitleApi", { params: this.VideoTitleParams })
        .then(function (response) {
          if (response.status == 200) {
            video_idx = response.data.idx;
            title = response.data.title;
          }
        });
    } else if (video_idx != "" && video_idx != null) {
      await axios
        .get("/VideoApi", { params: { video_idx: video_idx } })
        .then(function (response) {
          const data = response.data[0];
          if (data.platform == "직접 업로드") {
            // 직접 업로드 동영상
            link = video_path + String(video_idx) + "." + data.url;
            title = data.title;
            playtime = data.duration;
            length = data.duration;
          } else if (data.platform == "YOUTUBE") {
            // 유튜브 동영상
            link = data.url;
            title = data.title;
            playtime = data.duration;
            length = data.duration;
            platform = data.platform;
          }
        });
    }
    // length = length.toFixed();
    // formattedLength = length.toHHMMSS();

    var query = window.matchMedia("(orientation:landscape)");
    // console.log("Device held " + (query.matches ? "horizontally" : "vertically"));

    this.data = {
      video_idx: video_idx,
    };
    await axios
      .get(
        "/ItemDetail",
        { params: this.data },
        { headers: { "content-type": "application/json" } }
      )
      .then((response) => {
        if (response.status == 200) {
          itemDetail = response.data;
        }
      });

    // const set = Array.from(new Set(itemDetail.map(item => item.fk_item_idx)));
    // var datas = {
    //   itemIdx : set
    // }

    await axios
      .get("/AdbMatchVideoApi", { params: { fk_video_idx: video_idx } })
      .then((response) => {
        videoAdbMatching = response.data;
      });

    const fk_adb_idx = Array.from(
      new Set(videoAdbMatching.map((item) => item.fk_adb_idx))
    );
    var video_adb_idx = {
      adbIdx: fk_adb_idx,
    };

    await axios.get("/AdbApi", { params: video_adb_idx }).then((response) => {
      videoAdbs = response.data;
    });

    const fk_item_idx = Array.from(
      new Set(videoAdbs.map((videoAdbs) => videoAdbs.fk_item_idx))
    );
    var adb_item_idx = {
      itemIdx: fk_item_idx,
    };

    await axios.get("/ItemApi", { params: adb_item_idx }).then((response) => {
      videoItems = response.data;
    });

    this.setState({
      length: playtime,
      link: link,
      platform: platform,
      videoMaxTime: playtime,
      formattedLength: formattedLength,
      videoTitle: title,
      nowOrientation: query.matches ? 1 : 0,
      itemDetail: itemDetail,
      videoAdbMatching: videoAdbMatching,
      videoAdbs: videoAdbs,
      videoItems: videoItems,
    });
    if (platform == "YOUTUBE") {
      this.setState({ loading: false });
    }
    this.setupCupertinoPane();
    videoAdbMatching.map((adb) => {
      if (adb.adb_type == 0) {
        this.addAItem(adb);
      }
      if (adb.adb_type == 1) {
        this.addBItem(adb);
      }
    });
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevState.adbTouching !== this.state.adbTouching) {
      if (document.querySelector(".pane")) {
        let pane = document.querySelector(".pane");

        let timeout = setTimeout(() => {
          pane.style.opacity = "0";
          pane.style.zIndex = "-1";
          this.setState({
            d: false,
            adb_d_list: [],
            removeStack: 0,
          });
          clearInterval(adbClose);
        }, 5000);

        const adbClose = setInterval(() => {
          if (this.state.adbTouching) {
            clearTimeout(timeout);
            clearInterval(adbClose);
          }
        }, 100);
      }
    }
    if (
      prevState.videoHeight !== this.state.videoHeight &&
      this.state.myPane != null
    ) {
      this.state.myPane.setBreakpoints({
        top: {
          enabled: true,
          height: this.state.videoHeight / 100,
        },
        middle: {
          enabled: true,
          height: (this.state.videoHeight / 100) * 30,
          bounce: true,
        },
        bottom: {
          enabled: true,
          height: (this.state.videoHeight / 100) * 10,
        },
      });
    }
  }

  progressTime(e) {
    String.prototype.toHHMMSS = function () {
      let sec_num = parseInt(this, 10);
      let hour = Math.floor(sec_num / 3600);
      let min = Math.floor((sec_num - hour * 3600) / 60);
      let sec = sec_num - hour * 3600 - min * 60;
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      return hour + ":" + min + ":" + sec;
    };
    var cur = e.playedSeconds;
    // cur = cur.toFixed();
    // cur = cur.toHHMMSS();
    this.setState({ currentTime: cur });
  }

  play() {
    this.duration();
    const v = document.getElementById("v");
    const play_pause = document.querySelector(".play_pause");

    this.setState({
      paused: !this.state.paused,
    });

    if (this.state.paused == true) {
      v.play();
      this.setState({
        paused: false,
      });
    } else {
      v.pause();
      this.setState({
        paused: true,
      });
    }
  }

  async duration() {
    if (document.getElementById("v")) {
      let dur = document.getElementById("v").duration;
      if (!isNaN(dur) && dur !== undefined && this.state.loading) {
        await this.setState({
          loading: false,
        });
        let video = document.getElementById("v");
        video.pause();
        this.LoadingTimeOut = setTimeout(() => {
          let promise = document.getElementById("v").play();
          //가장 처음 컨트롤러가 켜지고 2.5초 후에 꺼지게 하기
          if (this.state.control == false) {
            this.initControlerTimeOut = setTimeout(() => {
              this.setState({
                control: false,
              });
            }, 3000);
          }
          if (this.state.control == true) {
            try {
              clearTimeout(this.initControlerTimeOut);
            } catch {}
          }
          if (promise !== undefined) {
            promise
              .then((_) => {
                this.setState({
                  paused: false,
                  control: true,
                });
              })
              .catch((error) => {
                // 자동 재생이 막힘.
                this.setState({
                  paused: true,
                  control: true,
                });
              });
          }
        }, 3000);
      }
      return dur;
    }
    return null;
  }

  currentTime() {
    String.prototype.toHHMMSS = function () {
      let sec_num = parseInt(this, 10);
      let hours = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - hours * 3600) / 60);
      let seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return hours + ":" + minutes + ":" + seconds;
    };

    if (document.getElementById("v")) {
      if (document.getElementById("v").currentTime != null) {
        let cur = document.getElementById("v").currentTime;
        cur = cur.toFixed();
        let formattedTime = cur.toHHMMSS();

        this.setState({
          currentTime: cur,
          formattedTime: formattedTime,
        });
        if (parseInt(this.state.currentTime) === parseInt(this.state.length)) {
          this.setState({ paused: true });
        }

        return cur;
      }
    }
  }

  customTime(type) {
    if (document.querySelector(".time_range")) {
      const time_range = document.querySelector(".time_range");
      if (type == "back") {
        time_range.value = parseInt(time_range.value) - 10;
      } else if (type == "next") {
        time_range.value = parseInt(time_range.value) + 10;
      }
      document.getElementById("v").currentTime = time_range.value;
    }
  }

  drawItem(data) {
    let screen = document.getElementById("FullScreenElement");
    this.setState({
      item_draw: this.state.item_draw.concat({
        position: "absolute",
        display: "inline-block",
        background: "rgba(0, 0, 0, 0.3)",
        left: data.x * (screen.offsetWidth / 1920),
        top: data.y * (screen.offsetHeight / 1080),
        width: data.width * (screen.offsetWidth / 1920),
        height: data.height * (screen.offsetHeight / 1080),
      }),
    });
  }

  addAItem(data) {
    let adb = this.state.videoAdbs.filter((adb) => {
      return adb.idx == data.fk_adb_idx;
    });
    this.setState({
      adb_a_item: {
        idx: data.fk_adb_idx,
        expo_count: data.expo_count,
        use_start_data: data.use_start_data,
        use_end_data: data.use_end_data,
        url: adb[0].url,
      },
      a: true,
    });
    const adbAOpen = setInterval(() => {
      this.setState({ a: true });
    }, (this.state.videoMaxTime / data.expo_count) * 1000);
  }
  adb_a_close() {
    this.setState({ a: false });
  }
  addBItem(data) {
    this.setState({
      adb_b_item: {
        idx: data.idx,
        url: data.url,
      },
      b: true,
    });
  }
  addCItem(data) {
    this.setState({
      adb_c_list: {
        idx: data.idx,
        fk_item_idx: data.fk_item_idx,
        type: data.type,
        status: data.status,
        name: data.name,
        brand: data.brand,
        adb_agency: data.adb_agency,
        image_url: data.image_url,
        description: data.description,
        tags: data.tags,
        url: data.url,
      },
      c: true,
    });
    // let timeout = setTimeout(() => {
    //   this.setState({
    //     c: false,
    //     adb_c_list: {},
    //   })
    // }, 10000)
  }
  addDItem(data) {
    this.setState({
      adb_d_list: [],
    });
    for (var i = 0; i < this.state.videoItems.length; i++) {
      this.setState({
        adb_d_list: this.state.adb_d_list.concat({
          idx: this.state.videoItems[i].idx,
          name: this.state.videoItems[i].title,
          image_url:
            `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
            this.state.videoItems[i].idx +
            "/item_1.jpg",
          // image_url: '//27.96.135.25:8000/static/item_images/' + this.state.videoItems[i].idx + '/item_1.jpg',
          url: this.state.videoItems[i].url,
        }),
      });
      if (
        i == this.state.videoItems.length - 1 &&
        this.state.videoItems.length < 6
      ) {
        this.setState({
          adb_d_list: this.state.adb_d_list.concat({
            idx: data.idx,
            name: data.name,
            image_url:
              `${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/` +
              data.idx +
              ".jpg",
            // image_url: '//27.96.135.25:8000/static/advertise_images/' + data.idx + '.jpg',
            url: data.url,
          }),
        });
      } else if (i == 5) {
        this.setState({
          adb_d_list: this.state.adb_d_list.concat({
            idx: data.idx,
            name: data.name,
            image_url:
              `${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/` +
              data.idx +
              ".jpg",
            // image_url: '//27.96.135.25:8000/static/advertise_images/' + data.idx + '.jpg',
            url: data.url,
          }),
        });
      }
    }
  }

  runBoshowInterval() {
    this.getItemDetail = setInterval(() => {
      if (this.video || this.video != null) {
        var currentTime = "";
        if (this.state.platform == "YOUTUBE") {
          currentTime = this.state.currentTime;
        } else {
          currentTime = this.video.currentTime;
        }
        var prevTime = currentTime - 0.0166666666666666666666665;
        var futureTime = currentTime + 0.0166666666666666666666665;
        // var prevTime = parseFloat(currentTime) - 100;
        // var futureTime = parseFloat(currentTime) + 100;

        // 현재시간 기반 데이터 검색
        if (this.state.itemDetail !== undefined) {
          let itemList = this.state.itemDetail.filter((data) => {
            return (
              data.position_time >= prevTime && data.position_time <= futureTime
            );
          });
          // console.log(itemList);

          if (itemList.length > 0 && !this.state.isItemExist) {
            this.setState({ isItemExist: true });
            let isAdb = this.state.videoAdbs.filter((data) => {
              if (itemList.length > 0) {
                // 여기서 모든 itemList를 반복해야 함
                let value = [];
                for (var i; i < itemList.length; i++) {
                  if (data.fk_item_idx == itemList[i].fk_item_idx) {
                    value.concat(data.fk_item_idx == itemList[i].fk_item_idx);
                  }
                }
                return value;
              }
            });
            if (isAdb.length > 0) {
              isAdb.map((adb) => {
                // console.log(adb)
                switch (adb.type) {
                  // case 0:
                  //   this.addAItem(adb)
                  //   break;
                  case 1:
                    this.addBItem(adb);
                    break;
                  case 2:
                    this.addCItem(adb);
                    break;
                  case 3:
                    this.addDItem(adb);
                    if (document.querySelector(".pane")) {
                      let pane = document.querySelector(".pane");
                      pane.style.opacity = "1";
                      pane.style.zIndex = "30";
                    }

                    if (document.querySelector(".pane")) {
                      let pane = document.querySelector(".pane");

                      let timeout = setTimeout(() => {
                        pane.style.opacity = "0";
                        pane.style.zIndex = "-1";
                        this.setState({
                          d: false,
                          adb_d_list: [],
                          removeStack: 0,
                        });
                        clearInterval(adbClose);
                      }, 5000);

                      const adbClose = setInterval(() => {
                        if (this.state.adbTouching) {
                          clearTimeout(timeout);
                          clearInterval(adbClose);
                        }
                      }, 100);
                    }
                    break;
                }
              });
            }
            // console.log(this.state.videoAdbs);
          } else if (itemList.length < 1) {
            this.setState({ isItemExist: false });
            if (
              this.state.removeStack > 150 &&
              !document.querySelector(".pane")
            ) {
              this.setState({
                d: false,
                adb_d_list: [],
                removeStack: 0,
              });
            } else {
              this.setState({
                removeStack: this.state.removeStack + 1,
              });
            }
          }
        }
      }
    }, 28);
  }

  // CupertinoPane 크기 조정
  CupertinoPaneSet() {
    if (document.querySelector("#v")) {
      var Boshow_player = document.querySelector("#Boshow_player");
      var videoHeight = 0;
      var videoWidth = 0;
      var x = Boshow_player.offsetWidth;
      var y = Boshow_player.offsetHeight;
      if (y > x) {
        videoWidth = y;
        videoHeight = x;
      } else {
        videoWidth = x;
        videoHeight = y;
      }

      this.setState({
        videoHeight: videoHeight,
        videoWidth: videoWidth,
      });
    }
  }

  async setupCupertinoPane() {
    var target,
      target2 = null;
    let settings = {
      initialBreak: "bottom",
      parentElement: "#Boshow_player",
      buttonDestroy: false,
      fitScreenHeight: false,
      cssClass: "grapBoshow",
      touchAngle: 180,
    };
    if (document.querySelector(".cupertino-pane")) {
      let myPane = new CupertinoPane(".cupertino-pane", settings);
      myPane.setBreakpoints({
        top: {
          enabled: true,
          height: (this.state.videoHeight / 100) * 40,
        },
        middle: {
          enabled: true,
          height: (this.state.videoHeight / 100) * 30,
          bounce: true,
        },
        bottom: {
          enabled: true,
          height: (this.state.videoHeight / 100) * 10,
        },
      });
      await this.setState({
        myPane: myPane,
      });
      myPane.present({ animate: true });
      myPane.moveToHeight(700);
      if (document.querySelector(".draggable")) {
        var panel = document.querySelector(".draggable");
        panel.classList.add("bounce");
      }
    }
    if (document.querySelector(".pane")) {
      var pane = document.querySelector(".pane");
      pane.addEventListener("touchstart", this.GrapOn.bind(this), false);
      pane.addEventListener("touchend", this.GrapOff.bind(this), false);
      pane.onmousedown = this.ClickOn.bind(this);
      // pane.onmouseleave = this.ClickOff.bind(this);
      // pane.addEventListener("mousedown", this.ClickOn.bind(this), false);
      // pane.addEventListener("mouseup", this.ClickOff.bind(this), false);
      var cupertino = document.querySelector(".grapBoshow");
      cupertino.setAttribute("id", "cupertino");
      this.swiperInit();
    }
  }

  ClickOn(e) {
    if (this.state.myPane && !this.state.adbTouching) {
      this.state.myPane.enableDrag();
      this.setState({
        adbTouching: true,
      });
    }
  }

  ClickOff(e) {
    if (e.toElement == null && e.relatedTarget == null) {
      if (this.state.myPane && this.state.adbTouching) {
        this.state.myPane.disableDrag();
        this.setState({
          adbTouching: false,
        });
      }
    }
  }

  GrapOn(e) {
    // event.preventDefault();
    var target = e.target;
    if (target == document.querySelector(".move") && !this.state.bounce) {
      var panel = document.querySelector(".draggable");
      panel.classList.add("bounce");
      this.state.myPane.moveToBreak("bottom");
      this.setState({
        bounce: true,
      });
      return;
    } else if (document.querySelector(".draggable")) {
      var panel = document.querySelector(".draggable");
      panel.classList.remove("bounce");
      this.state.myPane.moveToBreak("top");
      this.setState({
        bounce: false,
      });
    }
    this.setState({
      adbTouching: true,
    });
  }

  GrapOff(e) {
    // e.preventDefault();
    this.setState({
      adbTouching: false,
    });
  }

  handleAdbData(response) {
    let rData = JSON.parse(response.data);
    try {
      console.log(rData);
      if (rData.a.length > 0) {
        this.setState({ a: true });
      }
      if (rData.b.length > 0) {
        this.setState({ b: true });
      }
      if (rData.c.length > 0) {
        this.setState({ c: true });
        rData.d.map((item) => {
          this.addCItem(item);
        });
      }
      if (rData.d.length > 0) {
        this.setState({ d: true });
        rData.d.map((item) => {
          this.addDItem(item);
        });
        this.addPPLItemInDList();
      }
    } catch (e) {
      console.log(e);
    }
  }

  closeAdb() {
    this.setState({ isAdbOn: false });
  }

  openAdb() {
    this.setState({
      isAdbOn: true,
      // control: false,
      isAdbOnOff: !this.state.isAdbOnOff,
    });
  }

  onUnload = (e) => {
    const { cookies } = this.props;
    e.preventDefault();
    cookies.set("currentTime", this.state.currentTime);
  };

  addPPLItemInDList() {
    const listLength = this.state.adb_d_list.length;
    const pplPosition = this.getPPLPosition();

    const currentPPLPosition = Math.min(listLength, pplPosition);

    var datas = {
      isSpecial: true,
    };

    axios
      .get(
        "/AdbItems",
        { params: datas },
        { headers: { "content-type": "application/json" } }
      )
      .then((response) => {
        // this.state.adb_d_list.splice(currentPPLPosition, 0, response.data)
        this.state.adb_d_list.splice(5, 0, response.data);
      });
  }

  getPPLPosition() {
    const view = document.querySelector(".pane");

    var parentViewWidth = view.clientWidth;
    var childWidth = 130;

    return Math.max(parentViewWidth / childWidth, 0);
  }

  // 화면 조작
  screenControl() {
    // 화면 방향 확인

    var query = window.matchMedia("(orientation:landscape)");
    this.setState(
      {
        nowOrientation: query.matches ? 1 : 0,
      },
      () => {
        if (document.querySelector(".pane")) {
          let pane = document.querySelector(".pane");
          if (this.state.nowOrientation == 1) {
            pane.style.display = "inline-block";
          } else {
            pane.style.display = "none";
          }
        }
      }
    );
  }

  // AdbItemCheck(){
  //   if(document.querySelector('.draggable')){
  //     if(this.state.isItemExist){
  //       var panel = document.querySelector('.pane')
  //     }else if(!this.state.isItemExist){
  //       var panel = document.querySelector('.pane')
  //     }
  //   }
  // }

  swiperInit() {
    const swiper = document.querySelector(".swiper-container").swiper;

    swiper.init();
    var myPane = this.state.myPane;
    // console.log(myPane.currentBreak() === 'middle')
    if (myPane != undefined) {
      swiper.on("slideChange", function () {
        if (myPane) {
          myPane.disableDrag();
        }
      });
      swiper.on("slideChangeTransitionEnd", function () {
        if (myPane) {
          myPane.enableDrag();
        }
      });
      swiper.on("touchEnd", function () {
        if (myPane) {
          myPane.enableDrag();
        }
      });
    }
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload);
    window.onmouseout = this.ClickOff.bind(this);
    this.urlSet();
    if (this.state.platform != "YOUTUBE") {
      setInterval(() => this.setState({ currentTime: this.currentTime() }), 10);
    }
    setInterval(() => this.setState({ length: this.duration() }), 10);
    setInterval(() => this.screenControl(), 10);
    setInterval(() => this.CupertinoPaneSet(), 10);
    this.runBoshowInterval();
    // this.swiperInit();
  }

  openFullscreen() {
    if (!this.state.isIOS) {
      let doc = window.document;
      let docEl = doc.documentElement;

      const requestFullScreen =
        docEl.requestFullscreen ||
        docEl.mozRequestFullScreen ||
        docEl.webkitRequestFullScreen ||
        docEl.msRequestFullscreen;
      const cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;

      if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
      ) {
        requestFullScreen.call(docEl);
        this.makeLandscape();
      } else {
        cancelFullScreen.call(doc);
      }
    }
  }

  makeLandscape() {
    var screen = window.screen;
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape");
    }
  }

  closeBrowser() {
    var win = window.open("", "_self", "");
    var his = window.history;
    try {
      his.back();
    } catch {
      win.close();
    }
    return true;
  }
  //터치 이벤트
  controler(event) {
    if (this.state.myPane && this.state.adbTouching) {
      this.state.myPane.disableDrag();
      this.setState({
        adbTouching: false,
      });
      return;
    }
    var target = event.target;
    let controlerTimeOut = null;
    let controlerTimeCheck = null;

    if (!this.state.bounce) {
      var noReaction = [];
      noReaction.push(event.currentTarget.querySelectorAll("#cupertino *"));

      for (var i = 0; i < noReaction.length; i++) {
        if (target == event.currentTarget.querySelector("video")) {
          var panel = document.querySelector(".draggable");
          panel.classList.add("bounce");
          this.state.myPane.moveToBreak("bottom");
          this.setState({
            bounce: true,
          });
          return;
        }
        if (noReaction[i] == target) return;
      }
      if (target == noReaction) return;
    }

    if (this.state.isAdbOn) {
      // var noReaction = event.currentTarget.querySelectorAll("*");
      var noReaction = [];
      noReaction.push(event.currentTarget.querySelectorAll("#adb_d"));
      noReaction.push(event.currentTarget.querySelectorAll("#adb_d > *"));
      noReaction.push(event.currentTarget.querySelectorAll("#adb_d > * > *"));
      noReaction.push(
        event.currentTarget.querySelectorAll("#adb_d > * > * > *")
      );

      for (var i = 0; i < noReaction.length; i++) {
        for (var j = 0; j < noReaction[i].length; j++) {
          if (
            target ==
            event.currentTarget.querySelector("video", ".Boshow_player")
          ) {
            this.setState({
              isAdbOn: false,
            });
            return;
          }
          if (noReaction[i][j] == target) return;
        }
      }
      if (target == noReaction) return;
      this.setState({
        isAdbOn: false,
      });
    } else {
      // 1. Boshow 안의 무언가 내용이 있는 영역이면 pass
      var PlayerTags = event.currentTarget.querySelectorAll("*");
      for (var i = 0; i < PlayerTags.length; i++) {
        if (target == event.currentTarget.querySelector("video")) {
          this.setState(
            {
              control: !this.state.control,
            },
            () => {
              controlerTimeOut = setTimeout(() => {
                if (this.state.control && !this.state.time_range_touched) {
                  this.setState({
                    control: false,
                  });
                  clearInterval(controlerTimeCheck);
                }
              }, 3000);

              controlerTimeCheck = setInterval(() => {
                if (!this.state.control) {
                  clearTimeout(controlerTimeOut);
                  clearInterval(controlerTimeCheck);
                }
              }, 100);
            }
          );
          return;
        }
        if (PlayerTags[i] == target) return;
      }
      this.setState({
        control: !this.state.control,
      });
    }
  }

  onPipMode() {
    let video = document.querySelector("#v");
    if (this.state.isIOS) {
      const MODE_PIP = "picture-in-picture";
      const MODE_INLINE = "inline";
      video.webkitSetPresentationMode(
        video.webkitPresentationMode === MODE_PIP ? MODE_INLINE : MODE_PIP
      );
      return;
    }

    if (!document.pictureInPictureElement) {
      video.requestPictureInPicture().catch((error) => {
        // Video failed to enter Picture-in-Picture mode.
      });
    } else {
      document.exitPictureInPicture().catch((error) => {
        // Video failed to leave Picture-in-Picture mode.
      });
    }
  }

  time_range_touchStart() {
    this.setState({ time_range_touched: true });
  }

  time_range_touchEnd() {
    this.setState({ time_range_touched: false });
  }

  render() {
    const item_draw = this.state.item_draw.map((value, key) => {
      return <div key={key} style={value}></div>;
    });
    const a_item = (
      <>
        <AdbTypeA
          adb_idx={this.state.adb_a_item.idx}
          adb_url={this.state.adb_a_item.url}
          adb_close={this.adb_a_close}
        />
      </>
    );
    const c_list = (
      <>
        <AdbTypeC
          selected_adb={this.state.adb_c_list}
          selected_adb_b={this.state.adb_b_item}
        />
      </>
    );
    const d_list = this.state.adb_d_list.map((data) => {
      return (
        <SwiperSlide>
          <a href={data.url}>
            <img src={data.image_url} className="advertise_img_type_d"></img>
            <div>{data.name}</div>
            {/* <div>{data.description}</div> */}
          </a>
        </SwiperSlide>
      );
    });
    return (
      <>
        <div className={this.state.loading ? "Loading" : "Loading close"}>
          <img
            src={Loading}
            style={{ width: "30%" }}
            className={
              this.state.loading ? "Loading_move" : "Loading_move close"
            }
          ></img>
          <img
            src={Boshow_Loading}
            className={
              this.state.loading ? "BoshowLoading none" : "BoshowLoading"
            }
          ></img>
        </div>
        <div
          id="Boshow_player"
          className={
            this.state.nowOrientation == 0
              ? "Boshow_player"
              : "Boshow_player landscape_player"
          }
          onClick={this.controler.bind(this)}
        >
          <p
            className={
              this.state.loading
                ? "orientation_guide only_top"
                : "orientation_guide"
            }
          >
            <img src={ic_video_landscape}></img>
          </p>
          <div id="FullScreenElement">
            <div id="adbElement">
              {/* Adb - A*/}
              {this.state.a && this.state.nowOrientation == 1 && a_item}

              {/* Adb - B*/}
              {/* {
                    this.state.b && <div id="adb_b" style={{backgroundColor: "#00ff00"}} >
                      {b_item}
                    </div>
                  } */}

              {/* Adb - C*/}
              {this.state.c && this.state.nowOrientation == 1 && c_list}

              {/* Adb - D*/}
              {
                // <div id="adb_d" className={((this.state.isAdbOn && this.state.d) || this.state.isAdbOn) ? "onAdb_type_d" : "" }>
                // {/* <button onClick={this.closeAdb.bind(this)} className="advertise_type_b_close">X</button> */}
                //   <ul>
                //     {d_list}
                //   </ul>
                // </div>
              }
            </div>
            {this.state.platform === "YOUTUBE" ? (
              <>
                <ReactPlayer
                  url={this.state.link}
                  // className='react-player'
                  width="100%"
                  height="100%"
                  onProgress={this.progressTime.bind(this)}
                  ref={(ref) => {
                    this.video = ref;
                  }}
                  controls
                  autoPlay
                />
                {/* <YouTube id="" videoId={this.state.link.substr(32, 11)}/> */}
                {/* <div id="v"></div> */}
              </>
            ) : (
              <video
                id="v"
                playsInline
                ref={(ref) => {
                  this.video = ref;
                }}
                src={this.state.link}
                autoPlay
              ></video>
            )}
            {item_draw}

            <div className="cupertino-pane">
              <Swiper
                className="mySwiper"
                spaceBetween={16}
                slidesPerView={6}
                freeMode={true}
              >
                {d_list}
              </Swiper>
            </div>

            <div
              id="controler"
              onClick={this.controler.bind(this)}
              className={
                this.state.control
                  ? "controls black_65"
                  : "controls black_65 close"
              }
            >
              {/* <div className="light_bar">
                        <button onClick={this.mute.bind(this)} className="brightness_btn">
                            <img src={ic_brightness} />
                        </button>
                        <input
                            type="range" className="volume_range" onChange={this.customVolume.bind(this)}
                            value={this.state.volume} step={0.1} min={0} max={1} />
                    </div> */}
              <div className="Boshow_top_botton">
                <button
                  className="Boshow_player_close_btn"
                  onClick={this.closeBrowser.bind(this)}
                >
                  <img src={ic_close}></img>
                  {this.state.videoTitle}
                </button>
                {this.state.isIOS ? (
                  <button
                    className="Boshow_player_pip_btn"
                    onClick={this.onPipMode.bind(this)}
                  >
                    <img src={ic_video_pip}></img>
                  </button>
                ) : (
                  ""
                )}
              </div>

              <button onClick={this.customTime.bind(this, "back")}>
                <img src={ic_back_10}></img>
              </button>

              <button onClick={this.play.bind(this)} className="play_pause_btn">
                <img
                  src={ic_video_start}
                  className={this.state.paused ? "" : "hide"}
                />
                <img
                  src={ic_video_pause}
                  className={this.state.paused ? "hide" : ""}
                />
              </button>

              <button onClick={this.customTime.bind(this, "next")}>
                <img src={ic_next_10}></img>
              </button>

              <div
                className={
                  this.state.nowOrientation == 0
                    ? "Boshow_ctrl Boshow_ctrl_vertical"
                    : "Boshow_ctrl"
                }
              >
                <div className="time_bar">
                  <span className="time">
                    <span className="video_time">
                      {this.state.formattedTime}
                    </span>
                    <input
                      type="range"
                      className={
                        this.state.time_range_touched
                          ? "time_range time_range_touched"
                          : "time_range"
                      }
                      onChange={this.customTime.bind(this)}
                      value={this.state.currentTime}
                      step={1}
                      min={0}
                      max={this.state.videoMaxTime}
                      onTouchStart={this.time_range_touchStart.bind(this)}
                      onTouchEnd={this.time_range_touchEnd.bind(this)}
                    />
                    <span className="video_length">
                      {this.state.formattedLength}
                    </span>
                  </span>
                </div>

                <div className="Boshow_ctrl_bar">
                  {/* <button className={this.state.isAdbOnOff ? "boshow_on" : "boshow_on close"} onClick={this.openAdb}>
                                <img src={ic_boshow_on}></img>
                            </button>
                            <button className={this.state.isAdbOnOff ? "boshow_on close" : "boshow_on"} onClick={this.openAdb}>
                                <img src={ic_boshow_off}></img>
                            </button> */}
                  {!this.state.isIOS && this.state.nowOrientation ? (
                    <button
                      onClick={this.openFullscreen.bind(this)}
                      className="fullScreenBtn"
                    >
                      <img src={ic_fullscreen}></img>
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {!this.state.isIOS && !this.state.nowOrientation ? (
                <button
                  onClick={this.openFullscreen.bind(this)}
                  className="fullScreenland_Btn"
                >
                  <img src={ic_land_fullscreen}></img>
                </button>
              ) : (
                ""
              )}
            </div>
            {/* {this.state.isItemExist ? 
                  <button className="bounce bounce_btn">
                    <img src={ic_boshow_on}></img>
                  </button> : ""
                } */}
          </div>
        </div>
      </>
    );
  }
}

export default withCookies(BoshowPlayer);
