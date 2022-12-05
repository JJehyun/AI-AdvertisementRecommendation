import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import Question from "../images/common/icons/ic_question.svg";
import search_filter from "../images/common/search_filter.png";
import videofilter from "../images/common/videofilter.png";
import TransmissionbottonIMG from "../images/common/TransmissionbottonIMG.png";
import AIConnectionIMG from "../images/common/AIConnectionIMG.png";
import searchsubmitbitton from "../images/common/searchsubmitbitton.png";
import { getCookie } from "../contents/user/cookies";

class Search extends Component {
  constructor(props) {
    super(props);
    let searchMode = this.props.searchMode;
    this.state = {
      title: "",
      adder: "",
      searchFilter: "",
      adb_type: "",
      level_0: "",
      level_1: "",
      level_2: "",
      level_3: "",
      f_date: undefined,
      b_date: undefined,
      dialogRender: false,
      headerTitle:
        searchMode === "video_list"
          ? "동영상 제목"
          : searchMode === "item_list"
          ? "상품명"
          : "광고명",
      clickfilter: false,
      connectboxon: false,
      connectboxoff: false,
      transmissionboxon: false,
      transmissionboxoff: false,
      aibox: false,
      tranbox: false,
    };
    this.level_0 = [];
    this.level_1 = [];
    this.level_2 = [];
    this.level_3 = [];
    registerLocale("ko", ko);
    this.handleChange = this.handleChange.bind(this);
    this.startDateChange = this.startDateChange.bind(this);
    this.endDateChange = this.endDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.itemCategory = this.itemCategory.bind(this);
  }

  async componentDidMount() {
    this.itemCategory();
  }

  itemCategory() {
    axios
      .get("/ItemCategoryApi", {
        params: {
          boshow_token: getCookie("boshow_token"),
          mode: "cate",
        },
      })
      .then((response) => {
        var data = response.data;
        for (var i in data) {
          if (data[i].level == 0) {
            this.level_0.push({ level_0: data[i] });
          }
          if (data[i].level == 1) {
            this.level_1.push({ level_1: data[i] });
          }
          if (data[i].level == 2) {
            this.level_2.push({ level_2: data[i] });
          }
          if (data[i].level == 3) {
            this.level_3.push({ level_3: data[i] });
          }
        }
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  startDateChange = (date) => {
    this.setState({
      f_date: date,
    });
  };

  endDateChange = (date) => {
    this.setState({
      b_date: date,
    });
  };

  SearchFilterFunc = (
    title,
    sdate,
    edate,
    adder,
    level_0,
    level_1,
    level_2,
    level_3,
    e
  ) => {
    let startDate = "";
    let endDate = "";
    if (sdate !== "" && edate !== "") {
      startDate =
        sdate.getFullYear() +
        "-" +
        (sdate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        sdate.getDate().toString().padStart(2, "0");
      endDate =
        edate.getFullYear() +
        "-" +
        (edate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        edate.getDate().toString().padStart(2, "0");
    }

    if (this.props.searchMode === "video_list") {
      this.searchData = {
        searchtitle: title,
        searchadder: adder,
        searchStartDate: startDate,
        searchEndDate: endDate,
      };
      axios
        .post("/VideoSearchApi", null, { params: this.searchData })
        .then((response) => {
          if (response.status == 200) {
            this.props.onSearchValue(response.data, 1);
          }
        });
    } else if (this.props.searchMode === "item_list") {
      this.searchItemData = {
        boshow_token: getCookie("boshow_token"),
        searchtitle: title,
        searchStartDate: startDate,
        searchEndDate: endDate,
        level_0: level_0,
        level_1: level_1,
        level_2: level_2,
        level_3: level_3,
      };
      axios
        .post("/ItemSearchApi", null, { params: this.searchItemData })
        .then((response) => {
          if (response.status == 200) {
            this.props.onSearchValue(response.data, 1);
          }
        });
    } else if (this.props.searchMode === "adb_list") {
      this.searchItemData = {
        searchtype: title,
        searchStartDate: startDate,
        searchEndDate: endDate,
      };
      axios
        .post("/AdbSearchApi", null, { params: this.searchItemData })
        .then((response) => {
          if (response.status == 200) {
            this.props.onSearchValue(response.data, 1);
          }
        });
    }
  };

  SearchAllFunc = (e) => {
    if (this.props.searchMode === "video_list") {
      axios.get("/VideoApi", null).then((response) => {
        if (response.status == 200) {
          this.props.onSearchValue(response.data, 1);
        }
      });
    } else if (this.props.searchMode === "item_list") {
      // axios.get('/ItemApi', {params: {boshow_token: localStorage.getItem('boshow_token')}})
      axios.get("/ItemApi", null).then((response) => {
        if (response.status == 200) {
          this.props.onSearchValue(response.data, 1);
        }
      });
    } else if (this.props.searchMode === "adb_list") {
      axios.get("/AdbApi", null).then((response) => {
        if (response.status == 200) {
          this.props.onSearchValue(response.data, 1);
        }
      });
    }
  };

  searchInitList(e) {
    e.preventDefault();
    this.props.isSearched(false);
    this.setState({
      title: "",
      adder: "",
      f_date: undefined,
      b_date: undefined,
      adb_type: "",
      level_0: "",
      level_1: "",
      level_2: "",
      level_3: "",
      connectboxon: false,
      connectboxoff: false,
      transmissionboxon: false,
      transmissionboxoff: false,
    });
    this.SearchAllFunc();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.isSearched && this.props.isSearched(true);
    if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.adder != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        this.state.adder,
        "",
        "",
        "",
        ""
      );
    } else if (
      this.state.adb_type != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.adder != ""
    ) {
      this.SearchFilterFunc(
        this.state.adb_type,
        this.state.f_date,
        this.state.b_date,
        this.state.adder
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        "",
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        "",
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        "",
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        this.state.level_2,
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        "",
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.level_0 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.level_0 != "" &&
      this.state.level_1 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.level_0 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.level_0 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        "",
        "",
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (
      this.state.title != "" &&
      this.state.level_1 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        "",
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        "",
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (this.state.title != "" && this.state.level_0 != "") {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        this.state.level_0,
        "",
        "",
        ""
      );
    } else if (this.state.title != "" && this.state.level_1 != "") {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        "",
        this.state.level_1,
        "",
        ""
      );
    } else if (this.state.title != "" && this.state.level_2 != "") {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        "",
        "",
        this.state.level_2,
        ""
      );
    } else if (this.state.title != "" && this.state.level_3 != "") {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        "",
        "",
        "",
        "",
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_1 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        "",
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_0 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        this.state.level_0,
        "",
        "",
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_1 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        this.state.level_1,
        "",
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        this.state.level_2,
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        "",
        this.state.level_3
      );
    } else if (
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_2 != ""
    ) {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (
      this.state.level_0 != "" &&
      this.state.level_1 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (
      this.state.level_0 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.level_1 != "" &&
      this.state.level_2 != "" &&
      this.state.level_3 != ""
    ) {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        this.state.level_3
      );
    } else if (this.state.level_0 != "" && this.state.level_1 != "") {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        this.state.level_0,
        this.state.level_1,
        "",
        ""
      );
    } else if (this.state.level_0 != "" && this.state.level_2 != "") {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        this.state.level_0,
        "",
        this.state.level_2,
        ""
      );
    } else if (this.state.level_0 != "" && this.state.level_3 != "") {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        this.state.level_0,
        "",
        "",
        this.state.level_3
      );
    } else if (this.state.level_1 != "" && this.state.level_2 != "") {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        "",
        this.state.level_1,
        this.state.level_2,
        ""
      );
    } else if (this.state.level_1 != "" && this.state.level_3 != "") {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        "",
        this.state.level_1,
        "",
        this.state.level_3
      );
    } else if (this.state.level_2 != "" && this.state.level_3 != "") {
      this.SearchFilterFunc(
        "",
        "",
        "",
        "",
        "",
        "",
        this.state.level_2,
        this.state.level_3
      );
    } else if (
      this.state.title != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined
    ) {
      this.SearchFilterFunc(
        this.state.title,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        "",
        ""
      );
    } else if (
      this.state.adder != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        this.state.adder,
        "",
        "",
        "",
        ""
      );
    } else if (
      this.state.adb_type != "" &&
      this.state.f_date != undefined &&
      this.state.b_date != undefined
    ) {
      this.SearchFilterFunc(
        this.state.adb_type,
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        "",
        ""
      );
    } else if (this.state.title != "" && this.state.adder != "") {
      this.SearchFilterFunc(
        this.state.title,
        "",
        "",
        this.state.adder,
        "",
        "",
        "",
        ""
      );
    } else if (this.state.adb_type != "" && this.state.adder != "") {
      this.SearchFilterFunc(
        this.state.adb_type,
        "",
        "",
        this.state.adder,
        "",
        "",
        "",
        ""
      );
    } else if (
      this.state.f_date != undefined &&
      this.state.b_date != undefined
    ) {
      this.SearchFilterFunc(
        "",
        this.state.f_date,
        this.state.b_date,
        "",
        "",
        "",
        "",
        ""
      );
    } else if (this.state.title != "") {
      this.SearchFilterFunc(this.state.title, "", "", "", "", "", "", "");
    } else if (this.state.adb_type != "") {
      this.SearchFilterFunc(this.state.adb_type, "", "", "", "", "", "", "");
    } else if (this.state.adder != "") {
      this.SearchFilterFunc("", "", "", this.state.adder, "", "", "", "");
    } else if (this.state.level_0 != "") {
      this.SearchFilterFunc("", "", "", "", this.state.level_0, "", "", "");
    } else if (this.state.level_1 != "") {
      this.SearchFilterFunc("", "", "", "", "", this.state.level_1, "", "");
    } else if (this.state.level_2 != "") {
      this.SearchFilterFunc("", "", "", "", "", "", this.state.level_2, "");
    } else if (this.state.level_3 != "") {
      this.SearchFilterFunc("", "", "", "", "", "", "", this.state.level_3);
    } else {
      this.SearchAllFunc();
    }
  };

  handleDialogRender = (e) => {
    if (e.type === "mouseover")
      this.setState({
        dialogRender: true,
      });
    else {
      this.setState({
        dialogRender: false,
      });
    }
  };

  render() {
    const searchTitle = {
      height: "42px",
      lineHeight: "42px",
      fontSize: "16px",
      fontWeight: 600,
      color: "#121212",
    };

    const DialogBox = () => {
      return (
        <span
          style={{
            display: `${this.state.dialogRender ? "inline-block" : "none"}`,
            zIndex: 10,
            position: "absolute",
            fontSize: "12px",
            border: "0.5px solid #ffffff",
            borderRadius: "5px",
            boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.16)",
            background: "#ffffff",
            color: "#b4b4b4",
            padding: "9px 25px 9px 21px",
            lineHeight: "16px",
          }}
        >
          동영상 목록은 기본적으로 최근 등록한 동영상이
          <br />
          노출됩니다. 찾고 싶은 동영상이 있다면 입력칸을
          <br />
          활용하여 검색해보세요!
        </span>
      );
    };

    return (
      <>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="list_search">
            <div>
              <span style={searchTitle}>검색</span>
              {this.props.searchMode === "video_list" && (
                <img
                  src={Question}
                  alt="question"
                  style={{ top: "5px", position: "relative" }}
                  onMouseOver={this.handleDialogRender}
                  onMouseOut={this.handleDialogRender}
                />
              )}
              {this.props.searchMode === "video_list" ? <DialogBox /> : ""}
            </div>

            <table>
              <tr>
                <td
                  className={
                    this.props.searchMode === "adb_list" ? "active" : "hide"
                  }
                >
                  타입
                </td>
                <td
                  className={
                    this.props.searchMode !== "adb_list" ? "active" : "hide"
                  }
                >
                  {this.state.headerTitle}
                </td>
                <td>날짜</td>
                <td
                  className={
                    this.props.searchMode !== "video_list" ? "hide" : "active"
                  }
                >
                  등록자
                </td>
              </tr>
              <tr>
                <td
                  className={
                    this.props.searchMode === "adb_list" ? "active" : "hide"
                  }
                >
                  <select
                    name="adb_type"
                    onChange={this.handleChange.bind(this)}
                    value={this.state.adb_type}
                  >
                    <option value="" selected>
                      광고타입 선택
                    </option>
                    <option value="0">A타입</option>
                    <option value="1">B타입</option>
                    <option value="2">C타입</option>
                    <option value="3">D타입</option>
                    <option value="4">고정광고</option>
                  </select>
                </td>
                <td
                  style={{ width: "233px" }}
                  className={
                    this.props.searchMode !== "adb_list" ? "active" : "hide"
                  }
                >
                  <input
                    name="title"
                    type="text"
                    className="title"
                    value={this.state.title}
                    onChange={this.handleChange.bind(this)}
                  />
                </td>
                <td
                  className="date"
                  style={
                    this.props.searchMode !== "adb_list"
                      ? { width: "230px" }
                      : { width: "840px" }
                  }
                >
                  <DatePicker
                    selected={this.state.f_date}
                    onChange={this.startDateChange}
                    selectsStart
                    maxDate={new Date()}
                    shouldCloseOnSelect={true}
                    dateFormat="yyyy-MM-dd"
                    locale="ko"
                  />
                  ~
                  <DatePicker
                    selected={this.state.b_date}
                    onChange={this.endDateChange}
                    selectsEnd
                    minDate={this.state.f_date}
                    maxDate={new Date()}
                    locale="ko"
                    dateFormat="yyyy-MM-dd"
                  />
                </td>
                <td
                  style={{ width: "115px" }}
                  className={
                    this.props.searchMode !== "video_list" ? "hide" : "active"
                  }
                >
                  <input
                    name="adder"
                    type="text"
                    className="adder"
                    value={this.state.adder}
                    onChange={this.handleChange.bind(this)}
                  />
                </td>
                {this.props.searchMode !== "video_list" ? <td></td> : <></>}
                {/*동영상 관리 페이지 필터 부분 추가 한 코드 시작*/}
                <td
                  style={{ position: "relative", zIndex: "999999" }}
                  className={
                    this.props.searchMode !== "video_list" ? "hide" : "active"
                  }
                >
                  <div style={{ position: "absolute", top: "3.5px" }}>
                    <img
                      width="50px"
                      style={{ cursor: "pointer" }}
                      src={videofilter}
                      onClick={() => {
                        this.setState({ clickfilter: !this.state.clickfilter });
                      }}
                    />
                    {this.state.clickfilter == true ? (
                      <>
                        <div className="filterboxss">
                          <ul style={{ position: "relative" }}>
                            <div
                              className="transBox"
                              onClick={() => {
                                this.setState({ albox: !this.state.albox });
                              }}
                            >
                              {" "}
                              송출상태{" "}
                              {this.state.albox ? (
                                <span className="transBox">▽</span>
                              ) : (
                                <span className="transBox">△</span>
                              )}
                            </div>
                            {this.state.albox ? (
                              <>
                                {" "}
                                <li
                                  className="checkboxSearcher"
                                  onClick={() => {
                                    this.setState({
                                      connectboxon: !this.state.connectboxon,
                                    });
                                    this.props.OnTransmissionOnSsss(
                                      this.state.connectboxon
                                    );
                                  }}
                                  style={{ top: "32px", left: "9px" }}
                                >
                                  <span
                                    className={
                                      this.state.connectboxon == false
                                        ? "bordercheckboxSearchBox"
                                        : "bordercheckboxcheck"
                                    }
                                  ></span>
                                  완료
                                </li>
                                <li
                                  className="checkboxSearcher"
                                  onClick={() => {
                                    this.setState({
                                      connectboxoff: !this.state.connectboxoff,
                                    });
                                    this.props.OffTransmissionOnSs(
                                      this.state.connectboxoff
                                    );
                                  }}
                                  style={{ top: "47px", left: "9px" }}
                                >
                                  <span
                                    className={
                                      this.state.connectboxoff == false
                                        ? "bordercheckboxSearchBox"
                                        : "bordercheckboxcheck"
                                    }
                                  ></span>
                                  대기
                                </li>
                              </>
                            ) : (
                              <></>
                            )}
                          </ul>
                          <ul style={{ position: "relative" }}>
                            <div
                              className="Aiboxtoll"
                              onClick={() => {
                                this.setState({ tranbox: !this.state.tranbox });
                              }}
                            >
                              연결 상태{" "}
                              {this.state.tranbox ? (
                                <span className="Aiboxtoll">▽</span>
                              ) : (
                                <span className="Aiboxtoll">△</span>
                              )}{" "}
                            </div>
                            {this.state.tranbox ? (
                              <>
                                {" "}
                                <li
                                  className="checkboxSearcher"
                                  onClick={() => {
                                    this.setState({
                                      transmissionboxon:
                                        !this.state.transmissionboxon,
                                    });
                                    this.props.OnConnectionOnSs(
                                      this.state.transmissionboxon
                                    );
                                  }}
                                  style={{ top: "32px", left: "9px" }}
                                >
                                  <span
                                    className={
                                      this.state.transmissionboxon == false
                                        ? "bordercheckboxSearchBox"
                                        : "bordercheckboxcheck"
                                    }
                                  ></span>{" "}
                                  연결
                                </li>
                                <li
                                  className="checkboxSearcher"
                                  onClick={() => {
                                    this.setState({
                                      transmissionboxoff:
                                        !this.state.transmissionboxoff,
                                    });
                                    this.props.OffConnectionOffSs(
                                      this.state.transmissionboxoff
                                    );
                                  }}
                                  style={{ top: "47px", left: "-1.0px" }}
                                >
                                  <span
                                    className={
                                      this.state.transmissionboxoff == false
                                        ? "bordercheckboxSearchBox"
                                        : "bordercheckboxcheck"
                                    }
                                    style={{ marginLeft: "20px" }}
                                  ></span>{" "}
                                  미연결
                                </li>{" "}
                              </>
                            ) : (
                              <></>
                            )}
                          </ul>
                          <div className="checkboxsubmitSearchBox">
                            <img
                              src={searchsubmitbitton}
                              onClick={() => {
                                this.setState({
                                  clickfilter: !this.state.clickfilter,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            </table>

            {/* <td>
                                    <button className="search_filter">
                                        <img src={search_filter} />
                                    </button>
                                </td> */}
            {this.state.connectboxon == true ||
            this.state.connectboxoff ||
            this.state.transmissionboxon ||
            this.state.transmissionboxoff ? (
              <>
                <div
                  style={{ borderTop: "1px solid #b4b4b4", marginTop: "15px" }}
                ></div>
                <div style={{ display: "flex", marginTop: "15px" }}>
                  <div className="testesteste"></div>
                  {this.state.connectboxon == true ? (
                    <div
                      className={
                        this.state.connectboxon == true
                          ? "styled"
                          : "stylednone"
                      }
                      style={{ width: "170px" }}
                    >
                      <button
                        onClick={() => {
                          this.setState({
                            connectboxon: !this.state.connectboxon,
                          });
                          this.props.OnTransmissionOnSsss(
                            this.state.connectboxon
                          );
                        }}
                        className="filltercheckbuttonOne"
                      >
                        송출상태 (완료) X
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {this.state.connectboxoff == true ? (
                    <div
                      className={
                        this.state.connectboxoff == true
                          ? "styled"
                          : "stylednone"
                      }
                      style={{ width: "170px" }}
                    >
                      <button
                        onClick={() => {
                          this.setState({
                            connectboxoff: !this.state.connectboxoff,
                          });
                          this.props.OffTransmissionOnSs(
                            this.state.connectboxoff
                          );
                        }}
                        className="filltercheckbuttonOne"
                      >
                        송출상태 (대기) X
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {this.state.transmissionboxon == true ? (
                    <div
                      className={
                        this.state.transmissionboxon == true
                          ? "styled"
                          : "stylednone"
                      }
                      style={{ width: "170px" }}
                    >
                      <button
                        onClick={() => {
                          this.setState({
                            transmissionboxon: !this.state.transmissionboxon,
                          });
                          this.props.OnConnectionOnSs(
                            this.state.transmissionboxon
                          );
                        }}
                        className="filltercheckbuttonOne"
                      >
                        AI 연결 (연결) X
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                  {this.state.transmissionboxoff == true ? (
                    <div
                      className={
                        this.state.transmissionboxoff == true
                          ? "styled"
                          : "stylednone"
                      }
                    >
                      <button
                        className="filltercheckbuttonOne"
                        onClick={() => {
                          this.setState({
                            transmissionboxoff: !this.state.transmissionboxoff,
                          });
                          this.props.OffConnectionOffSs(
                            this.state.transmissionboxoff
                          );
                        }}
                      >
                        AI 연결 (미연결) X
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : null}
            {/*동영상 관리 페이지 필터 부분 추가 한 코드 여기가지 끝*/}
            {this.props.searchMode === "item_list" ? (
              this.level_0.length !== 0 ? (
                <div className="asd"></div>
              ) : null
            ) : (
              ""
            )}
            {this.state.connectboxon == true ||
            this.state.connectboxoff ||
            this.state.transmissionboxon ||
            this.state.transmissionboxoff ? null : (
              <table>
                {this.props.searchMode === "item_list" ? (
                  this.level_0.length !== 0 ? (
                    <>
                      <tr>
                        <td
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            height: "19px",
                          }}
                        >
                          카테고리
                        </td>
                      </tr>
                    </>
                  ) : null
                ) : (
                  ""
                )}
                {this.props.searchMode === "item_list" ? (
                  <tr>
                    {this.level_0.length !== 0 ? (
                      <td style={{ width: "155px" }}>
                        <select
                          name="level_0"
                          onChange={this.handleChange.bind(this)}
                          value={this.state.level_0}
                        >
                          <option value="" selected>
                            대분류
                          </option>
                          {this.level_0.map((level, key) => (
                            <option value={level.level_0.idx}>
                              {level.level_0.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    ) : (
                      ""
                    )}
                    {this.level_1.length !== 0 ? (
                      <td style={{ width: "155px" }}>
                        <select
                          name="level_1"
                          onChange={this.handleChange.bind(this)}
                          value={this.state.level_1}
                        >
                          <option value="" selected>
                            중분류
                          </option>
                          {this.level_1.map((level, key) => (
                            <option value={level.level_1.idx}>
                              {level.level_1.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    ) : (
                      ""
                    )}
                    {this.level_2.length !== 0 ? (
                      <td style={{ width: "155px" }}>
                        <select
                          name="level_2"
                          onChange={this.handleChange.bind(this)}
                          value={this.state.level_2}
                        >
                          <option value="" selected>
                            소분류
                          </option>
                          {this.level_2.map((level, key) => (
                            <option value={level.level_2.idx}>
                              {level.level_2.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    ) : (
                      ""
                    )}
                    {this.level_3.length !== 0 ? (
                      <td>
                        <select
                          name="level_3"
                          onChange={this.handleChange.bind(this)}
                          value={this.state.level_3}
                        >
                          <option value="" selected>
                            상세분류
                          </option>
                          {this.level_3.map((level, key) => (
                            <option value={level.level_3.idx}>
                              {level.level_3.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    ) : (
                      ""
                    )}
                  </tr>
                ) : (
                  ""
                )}
              </table>
            )}
            <div className="search_btn_group">
              <input type="submit" className="search_btn" value="검색" />
              <button type="button" onClick={this.searchInitList.bind(this)}>
                초기화
              </button>
            </div>
          </div>
        </form>
      </>
    );
  }
}

export default Search;
