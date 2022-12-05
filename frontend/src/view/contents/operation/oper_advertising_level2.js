import React, { Component } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../../components/pagination.js";
import { numberPad } from "../../components/common";

import op_adv_a from "../../images/common/op_adv_a.png";
import op_adv_b from "../../images/common/op_adv_b.png";
import op_adv_c from "../../images/common/op_adv_c.png";
import op_adv_d from "../../images/common/op_adv_d.png";

import VideoCheckModal from "./video_check_modal.js";
import AdbTypeA from "../../components/adb_type_a.js";
import AdbTypeB from "../../components/adb_type_b.js";
import AdbTypeC from "../../components/adb_type_c.js";
import AdbTypeD from "../../components/adb_type_d.js";

class OpAdvertisingListLevel2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post: [],
      selectedAdb: [],
      checkedAdb: [],
      current_page: 1,
      sidebarOpen: false,
      modalOpen: false,
      startDate: null,
      endDate: null,
      rangeDate: null,
      datepickerCheck: false,
      type: "",
      adb_title: "",
      videoDuration: this.props.videoList.duration,
      video: this.props.videoList,
      video_url:
        this.props.videoList.platform === "SBS"
          ? this.SbsURL(this.props.videoList.url)
          : this.props.videoList.platform === "YOUTUBE"
          ? "https://www.youtube.com/embed/" +
            this.props.videoList.url.split("?v=")[1]
          : `${process.env.REACT_APP_BACKEND_HOST}static/videos/` +
            String(this.props.videoList.idx) +
            "." +
            String(this.props.videoList.url),
      // video_url: this.props.videoList.platform === "SBS"? this.SbsURL(this.props.videoList.url):(this.props.videoList.platform === "YOUTUBE"?"https://www.youtube.com/embed/"+this.props.videoList.url.split('?v=')[1]:"//27.96.135.25/static/videos/"+String(this.props.videoList.idx)+"."+String(this.props.videoList.url))
    };
    this.category_list = { A: 0, B: 1, C: 2, D: 3 };
    this.onClose = false;
    this.selected_adb = [];
    this.checkedAdb = [];
    registerLocale("ko", ko);
    this.checkChange = this.checkChange.bind(this);
    this.adbList = this.adbList.bind(this);
  }

  adbList() {
    axios.get("/AdbApi", null).then((response) => {
      if (response.status == 200) {
        this.onClose = false;
        this.setState({
          posts: response.data,
        });
      }
    });
  }

  SbsURL = async (searchLink) => {
    var video_search_id;
    const search = searchLink;
    video_search_id = parseInt(search.match(new RegExp("[0-9]{11}", "g")));
    let token = "";
    let SBS_video_id = String(video_search_id);
    let sbs_media_url;
    await axios
      .get(`http:${process.env.REACT_APP_BACKEND_HOST}api/MakeSbsToken`, null, {
        headers: { "content-type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          token = response.data.token;
        }
      });
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
          sbs_media_url = response.data.mediaurl;
        } else if (response.status == 404) {
          alert("서버와 연결이 되지 않습니다.");
        } else if (response.status == 500) {
          alert("영상이 존재하지 않습니다.");
        }
      });
    return sbs_media_url;
  };

  paginate(page) {
    this.setState({
      current_page: page,
    });
  }

  modalOpen = () => {
    var selected_adb = this.selected_adb;
    var c = { 0: "A", 1: "B", 2: "C", 3: "D" };
    this.checkedAdb.splice(0);
    if (selected_adb.length !== 0) {
      for (var i = 0; i < selected_adb.length; i++) {
        var idx = selected_adb[i].idx;
        var type = selected_adb[i].type;
        var adb = selected_adb[i].adb;
        var stDate = this.state["sdate" + idx];
        var edDate = this.state["edate" + idx];
        if (type === 0) {
          if (
            this.state["rangeDate" + idx] !== "" &&
            this.state["rangeDate" + idx] !== undefined &&
            this.state["select_count_" + idx] !== undefined
          ) {
            this.checkedAdb.push({
              idx: idx,
              type: type,
              name: adb.name,
              url: adb.url,
              item_idx: adb.fk_item_idx,
              sDate: stDate,
              eDate: edDate,
              selectCount: this.state["select_count_" + idx],
            });
          } else {
            alert(
              "선택하신 " + c[type] + "에 집행 기간과 노출 횟수를 선택해주세요"
            );
          }
        } else {
          if (
            this.state["rangeDate" + idx] !== undefined &&
            this.state["rangeDate" + idx] !== ""
          ) {
            this.checkedAdb.push({
              idx: idx,
              type: type,
              name: adb.name,
              url: adb.url,
              item_idx: adb.fk_item_idx,
              sDate: stDate,
              eDate: edDate,
              selectCount: null,
            });
          } else {
            alert("선택하신 " + c[type] + "에 집행 기간을 선택해주세요");
          }
        }
        if (selected_adb.length === this.checkedAdb.length) {
          this.setState({ modalOpen: true, checkedAdb: this.checkedAdb });
        }
      }
    } else {
      alert("등록하실 타입의 광고를 선택해주세요.");
    }
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  selectAdbType(type, e) {
    e.preventDefault();
    var page = 1;
    var typeBtnClass = document.getElementsByName("Type");
    typeBtnClass.forEach((adb) => {
      adb.style.border = "solid 1px #e6e6e6";
      adb.style.backgroundColor = "#ffffff";
    });
    var typeBtn = document.getElementById(type + "Type");
    typeBtn.style.border = "solid 1px #4d20a3";
    typeBtn.style.backgroundColor = "#e4d6ff";
    axios.get("/AdbApi", { params: { type: type } }).then((response) => {
      this.setState({
        startDate: null,
        endDate: null,
        rangeDate: null,
        current_page: page,
        type: type,
      });
      if (response.data.length !== 0) {
        this.setState({
          posts: response.data,
          post: response.data.slice((page - 1) * 10, page * 10 - 1),
          type: type,
        });
        for (var j = 0; j < this.selected_adb.length; j++) {
          if (this.category_list[type] == this.selected_adb[j].type) {
            const checkOneAdb = document.getElementById(
              "list" + this.selected_adb[j].idx
            );
            const checkOff = document.getElementById(
              "DatepickerOff" + this.selected_adb[j].idx
            );
            const checkOn = document.getElementById(
              "DatepickerOn" + this.selected_adb[j].idx
            );
            checkOneAdb.checked = true;
            checkOff.style.display = "none";
            checkOn.style.display = "inline-block";
            if (
              document.getElementById("RangeDate" + this.selected_adb[j].idx)
                .value !== ""
            ) {
              const rangeDate = document.getElementById(
                "RangeDate" + this.selected_adb[j].idx
              );
              const checkOn = document.getElementById(
                "DatepickerOn" + this.selected_adb[j].idx
              );
              rangeDate.style.display = "inline-block";
              checkOn.style.display = "none";
            }
            if (this.category_list[type] == 0) {
              const selectCountOne = document.getElementById(
                "select_count_" + this.selected_adb[j].idx
              );
              selectCountOne.removeAttribute("disabled");
            }
          }
        }
      } else {
        this.setState({
          posts: [],
          post: [],
          type: type,
        });
      }
    });
  }

  setDateRange = (update) => {
    const [s, ed] = update;
    for (var i = 0; i < this.selected_adb.length; i++) {
      var c = { 0: "A", 1: "B", 2: "C", 3: "D" };
      var adb_type = this.state.type;
      if (this.state.type === "")
        adb_type = c[this.state["type_" + this.selected_adb[i].idx]];
      if (this.category_list[adb_type] == this.selected_adb[i].type) {
        if (s !== null && ed !== null) {
          var stDate =
            s.getFullYear() +
            "-" +
            (s.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            s.getDate().toString().padStart(2, "0");
          var sDate = stDate;
          var edDate =
            ed.getFullYear() +
            "-" +
            (ed.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            ed.getDate().toString().padStart(2, "0");
          var endDate = edDate;
          var eDate =
            (ed.getMonth() + 1).toString().padStart(2, "0") +
            "-" +
            ed.getDate().toString().padStart(2, "0");
          stDate = stDate.split("-");
          edDate = edDate.split("-");
          var a = new Date(stDate[0], stDate[1] - 1, stDate[2]);
          var b = new Date(edDate[0], edDate[1] - 1, edDate[2]);
          var days = (b.getTime() - a.getTime()) / 1000 / 60 / 60 / 24 + 1;
          this.onClose = false;
          this.setState({
            startDate: s,
            endDate: ed,
            rangeDate: sDate + "~" + eDate + ", 총" + days + "일",
            ["sdate" + this.selected_adb[i].idx]: sDate,
            ["edate" + this.selected_adb[i].idx]: endDate,
            ["rangeDate" + this.selected_adb[i].idx]:
              sDate + "~" + eDate + ", 총" + days + "일",
          });
          const rangeDate = document.getElementById(
            "RangeDate" + this.selected_adb[i].idx
          );
          const checkOn = document.getElementById(
            "DatepickerOn" + this.selected_adb[i].idx
          );
          rangeDate.style.display = "inline-block";
          checkOn.style.display = "none";
        } else {
          this.onClose = true;
          this.setState({
            startDate: s,
            endDate: ed,
            rangeDate: null,
          });
        }
      }
    }
  };

  selectChange(menu) {
    var min = parseInt(numberPad((this.state.videoDuration % 3600) / 60, 2));
    var idvc = document.getElementById("select_count_" + menu.idx);
    var select_view_count;
    if (min < 1) {
      select_view_count = idvc.options[1].value;
      alert("영상 길이가 너무 짧아 기본 1회로 선택되었습니다.");
    } else if (idvc.selectedIndex <= min)
      select_view_count = idvc.options[idvc.selectedIndex].value;
    else alert("노출 횟수가 영상 길이를 초과했습니다. 확인 후 재설정 해주세요");
    this.setState({
      ["select_count_" + menu.idx]: select_view_count,
    });
  }

  checkChange(adbList, e) {
    const typeList = { 0: "A", 1: "B", 2: "C", 3: "D" };
    const checkOneAdb = document.getElementById("list" + adbList.idx);
    const checkOff = document.getElementById("DatepickerOff" + adbList.idx);
    const checkOn = document.getElementById("DatepickerOn" + adbList.idx);
    const rangeDate = document.getElementById("RangeDate" + adbList.idx);

    if (e.target.checked) {
      if (
        this.selected_adb.findIndex((obj) => obj.type === adbList.type) === -1
      ) {
        checkOneAdb.checked = true;
        checkOff.style.display = "none";
        checkOn.style.display = "inline-block";
        if (adbList.type == 0) {
          const selectCountOne = document.getElementById(
            "select_count_" + adbList.idx
          );
          var idvc = document.getElementById("select_count_" + adbList.idx);
          idvc.options[idvc.selectedIndex].value = 0;
          selectCountOne.removeAttribute("disabled");
          this.setState({
            ["select_count_" + adbList.idx]: undefined,
          });
        }
        this.setState({
          ["type_" + adbList.idx]: adbList.type,
        });
        this.selected_adb.push({
          idx: adbList.idx,
          type: adbList.type,
          adb: adbList,
        });
        this.selectAdbType(typeList[adbList.type], e);
      } else {
        checkOneAdb.checked = false;
        alert("광고 타입별로 1개만 선택 가능합니다.");
      }
    } else {
      checkOneAdb.checked = false;
      checkOff.style.display = "inline-block";
      checkOn.style.display = "none";
      if (adbList.type == 0) {
        const selectCountOne = document.getElementById(
          "select_count_" + adbList.idx
        );
        selectCountOne.disabled = true;
        for (var i = 0; i < this.state.post.length; i++) {
          this.setState({
            ["select_count_" + this.state.post[i].idx]: undefined,
          });
        }
      }
      this.setState({
        ["type_" + adbList.idx]: "",
        ["rangeDate" + adbList.idx]: "",
      });
      rangeDate.style.display = "none";
      this.selected_adb.splice(
        this.selected_adb.findIndex((obj) => obj.idx === adbList.idx),
        1
      );
    }
  }

  AdbAdd(adb, e, transmission_status) {
    if (transmission_status !== 0) {
      const check = window.confirm(
        "검수과정을 거치지 않고 바로 송출됩니다. 정말 송출하시겠습니까?"
      );
      if (check === true) {
        this.addAdbMatch = {
          adb: adb,
          video_idx: this.state.video.idx,
        };
        axios
          .post(
            "/AdbMatchVideoApi",
            null,
            { params: this.addAdbMatch },
            { headers: { "content-type": "application/json" } }
          )
          .then((response) => {
            alert("광고가 등록 되었습니다.");
            window.location.reload();
          });
      } else {
        return;
      }
    }

    this.addAdbMatch = {
      adb: adb,
      video_idx: this.state.video.idx,
    };
    axios
      .post(
        "/AdbMatchVideoApi",
        null,
        { params: this.addAdbMatch },
        { headers: { "content-type": "application/json" } }
      )
      .then((response) => {
        alert("광고가 등록 되었습니다.");
        window.location.reload();
      });
  }

  onChangeAdbTitle(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  searchAdbCheckList(title, e) {
    e.preventDefault();
    if (this.state.type === "") {
      this.searchAdbData = {
        mode: "operAdbTitle",
        searchTitle: title,
      };
      axios
        .post(
          "/AdbSearchApi",
          null,
          { params: this.searchAdbData },
          { headers: { "content-type": "application/json" } }
        )
        .then((response) => {
          if (response.data.length !== 0) {
            this.setState({
              posts: response.data,
            });
          } else {
            this.adbList();
          }
        });
    } else {
      this.searchAdbTypeData = {
        mode: "operAdbType",
        searchTitle: title,
        type: this.category_list[this.state.type],
      };
      axios
        .post(
          "/AdbSearchApi",
          null,
          { params: this.searchAdbTypeData },
          { headers: { "content-type": "application/json" } }
        )
        .then((response) => {
          if (response.data.length !== 0) {
            this.setState({
              posts: response.data,
            });
          } else {
            this.adbList();
          }
        });
    }
  }

  setPost = (page) => {
    this.setState({
      post: this.state.posts.slice((page - 1) * 10, page * 10),
      current_page: page,
    });
  };

  onSetSidebarOpen = (check) => {
    this.setState({
      sidebarOpen: check, // bool
    });
  };

  render() {
    const categoryList = ["A타입", "B타입", "C타입", "D타입"];
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const show_count = 10;
    const page_count = 5;
    const btn2Style = {
      border: "solid 1px #4d20a3",
      backgroundColor: "#fff",
      fontSize: "14px",
      lineHeight: "1.43",
      letterSpacing: "-0.17px",
      color: "#4d20a3",
      display: "none",
      margin: "0 auto",
      padding: "4px 14px",
    };
    const btn1Style = {
      border: "solid 1px black",
      backgroundColor: "#fff",
      fontSize: "14px",
      lineHeight: "1.43",
      letterSpacing: "-0.17px",
      color: "black",
      display: "inline-block",
      margin: "0 auto",
      padding: "4px 14px",
    };
    let video_list = [];
    video_list = this.state.post.map((menu) => (
      <tr key={menu.idx}>
        {menu.type !== 4 ? (
          <td>
            <input
              type="checkbox"
              id={"list" + menu.idx}
              name="adb_idx"
              value={menu.idx}
              onChange={this.checkChange.bind(this, menu)}
            />
            <label for={"list" + menu.idx}>
              <span></span>
            </label>
          </td>
        ) : (
          <td>
            <input
              type="checkbox"
              id={"list" + menu.idx}
              name="adb_idx"
              value={menu.idx}
              readOnly
            />
          </td>
        )}
        <td>
          <img
            src={
              `${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/` +
              menu.idx +
              ".jpg"
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
        <td>{categoryList[menu.type]}</td>
        <td>{menu.adb_agency}</td>
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
        <td>
          <button
            id={"DatepickerOff" + menu.idx}
            name="dateOff"
            type="button"
            style={btn1Style}
          >
            기간지정
          </button>
          <DatePicker
            id={"DatepickerOn" + menu.idx}
            name="dateOn"
            key={menu.idx}
            minDate={new Date()}
            selectsRange={true}
            selected={this.state.startDate}
            value={this.state.rangeDate}
            shouldCloseOnSelect={this.onClose}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.setDateRange}
            customInput={
              <button type="button" style={btn2Style}>
                기간지정
              </button>
            }
            dateFormat="yyyy-MM-dd(eee)"
            locale="ko"
          />
          <input
            id={"RangeDate" + menu.idx}
            name="RangeDate"
            type="text"
            value={this.state["rangeDate" + menu.idx]}
            style={{ display: "none" }}
            readOnly
          ></input>
        </td>
        <td>
          {menu.type === 0 ? (
            <select
              id={"select_count_" + menu.idx}
              name="select_count"
              value={
                this.state["select_count_" + menu.idx] != undefined
                  ? this.state["select_count_" + menu.idx]
                  : ""
              }
              onChange={this.selectChange.bind(this, menu)}
              disabled
            >
              <option value="">선택</option>
              <option value={1}>1회</option>
              <option value={2}>2회</option>
              <option value={3}>3회</option>
              <option value={4}>4회</option>
              <option value={5}>5회</option>
              <option value={6}>6회</option>
              <option value={7}>7회</option>
              <option value={8}>8회</option>
              <option value={9}>9회</option>
              <option value={10}>10회</option>
            </select>
          ) : (
            ""
          )}
        </td>
      </tr>
    ));

    var a = {
      idx: 0,
    };

    const checkedAdb = this.state.checkedAdb.map((check) =>
      check.type === 0 ? (
        <AdbTypeA adb_idx={check.idx} />
      ) : check.type === 1 ? (
        (a.idx = check.idx)
      ) : // <AdbTypeB selected_adb={check} />
      check.type === 2 ? (
        <AdbTypeC selected_adb={check} selected_adb_b={a} />
      ) : (
        <AdbTypeD selected_adb={check} />
      )
    );

    return (
      <>
        <div className="video_list op_adv_list">
          <ul>
            <li
              name="Type"
              id="AType"
              onClick={this.selectAdbType.bind(this, "A")}
            >
              <h1>A 타입</h1>
              <p>
                플레이어 우측 상단에
                <br />
                보여지는 광고입니다.
              </p>
              <p>[광고 위치 예시]</p>
              <img src={op_adv_a} />
            </li>
            <li
              name="Type"
              id="BType"
              onClick={this.selectAdbType.bind(this, "B")}
            >
              <h1>B 타입</h1>
              <p>
                플레이어 상품상세보기 영역
                <br />
                우측 하단에 보여지는 광고입니다.
              </p>
              <p>[광고 위치 예시]</p>
              <img src={op_adv_b} />
            </li>
            <li
              name="Type"
              id="CType"
              onClick={this.selectAdbType.bind(this, "C")}
            >
              <h1>C 타입</h1>
              <p>
                플레이어 상품상세보기 영역에
                <br />
                슬라이드로 보여지는 광고입니다.
              </p>
              <p>[광고 위치 예시]</p>
              <img src={op_adv_c} />
            </li>
            <li
              name="Type"
              id="DType"
              onClick={this.selectAdbType.bind(this, "D")}
            >
              <h1>D 타입</h1>
              <p>
                플레이어 하단 끌어보쇼
                <br />
                영역에 보여지는 광고입니다.
              </p>
              <p>[광고 위치 예시]</p>
              <img src={op_adv_d} />
            </li>
          </ul>
          <div>
            <p
              style={{
                position: "absolute",
                left: "0px",
                color: "#6b6b6b",
                fontSize: "14px",
              }}
            >
              체크박스를 먼저 체크한 후 기간을 지정하세요
            </p>
            <ul>
              <li>
                <input
                  type="text"
                  name="adb_title"
                  value={this.state.adb_title}
                  onChange={this.onChangeAdbTitle.bind(this)}
                ></input>
                <button
                  type="button"
                  onClick={this.searchAdbCheckList.bind(
                    this,
                    this.state.adb_title
                  )}
                >
                  검색
                </button>
              </li>
            </ul>
          </div>
          <table className="table-library">
            <colgroup>
              <col width="65px" />
              <col width="182px" />
              <col width="200px" />
              <col width="100px" />
              <col width="100px" />
              <col width="100px" />
              <col width="100px" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>광고</th>
                <th>이름</th>
                <th>타입</th>
                <th>광고사</th>
                <th>작성일</th>
                <th>집행 기간</th>
                <th>노출 횟수</th>
              </tr>
            </thead>
            <tbody>
              {video_list.length !== 0 ? (
                video_list
              ) : (
                <tr>
                  <td colSpan="8">
                    {this.state.type}타입에 광고가 존재 하지 않습니다.
                  </td>
                </tr>
              )}
            </tbody>
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

          <button type="button" onClick={this.modalOpen.bind(this)}>
            광고 확인
          </button>
        </div>
        <VideoCheckModal
          open={this.state.modalOpen}
          close={this.closeModal}
          title="Create a chat room"
        >
          <div className="videocheckmodal">
            <main> {this.props.children} </main>
            <div>
              <div className="header">
                광고 확인
                <button type="button" onClick={this.closeModal}>
                  X
                </button>
              </div>
              <div className="preview">
                <p>
                  미리보기
                  <span>광고 송출 전 선택한 광고를 확인해보세요.</span>
                </p>
                <div className="video_preview_section">
                  {/* <AdbTypeA /> */}
                  {/* <AdbTypeA adb_idx={}/> */}
                  {/* <img src={"${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/1_1.png"} className="advertise_type_a"></img> */}
                  {checkedAdb}
                  {this.state.video.platform === "YOUTUBE" ? (
                    <iframe src={this.state.video_url} />
                  ) : (
                    <video src={this.state.video_url} controls />
                  )}
                </div>
                {this.state.video.transmission_status !== 0 ? (
                  <button
                    type="button"
                    onClick={this.AdbAdd.bind(this, this.checkedAdb, true)}
                    style={{ backgroundColor: "#FF3A3A" }}
                  >
                    바로 송출하기
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={this.AdbAdd.bind(this, this.checkedAdb, false)}
                  >
                    등록하기
                  </button>
                )}
              </div>
            </div>
          </div>
        </VideoCheckModal>
      </>
    );
  }
}

export default OpAdvertisingListLevel2;
