import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";
import Search from "../../components/search.js";
import Pagination from "../../components/pagination.js";
import DropZone from "react-dropzone";

class AdvertisingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      post: [],
      check_ad: [],
      current_page: 1,
      update_adb: {},
      updateImg: null,
      update_image: "",
    };
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
          update_image: render.result,
        });
      };
      render.readAsDataURL(file);
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.adbUpdateOn = this.adbUpdateOn.bind(this);
    this.adbUpdateOff = this.adbUpdateOff.bind(this);
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
    var formData = new FormData();
    formData.append("file", this.state.updateImg);
    formData.append("update_idx", this.state.update_adb.idx);
    formData.append("update_name", this.state.update_name);
    formData.append("update_type", this.state.update_type);
    formData.append("update_agency", this.state.update_agency);
    // var update_adb = {
    //     update_idx: this.state.update_adb.idx,
    //     update_name: this.state.update_name,
    //     update_type: this.state.update_type,
    //     update_agency: this.state.update_agency,
    // }
    axios({
      method: "put",
      url: "/AdbApi",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      console.log(response);
      if (response.status == 200) {
        alert("광고 수정에 성공하셨습니다.");
        window.location.reload(); //새로고침;
        // this.props.history.push('/advertising_list')
      } else {
        alert("광고 수정에 실패하셨습니다.");
        return false;
      }
    });
    // axios.put('/AdbApi', null, {params: update_adb})
    // .then(response => {
    //     alert('수정 완료');
    //     window.location.reload(); //새로고침
    // })
  }

  async adbUpdateOn(e) {
    const { value } = e.target;

    await this.setState({
      update_adb: this.state.post[value],
    });
    if (this.state.update_adb) {
      this.setState({
        update_image:
          `${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/` +
          this.state.update_adb.idx +
          ".jpg",
        update_idx: this.state.update_adb.idx,
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
      post: this.state.posts.slice((page - 1) * 10, page * 10),
      current_page: page,
    });
  }

  handleCheck(e) {
    const value = parseInt(e.target.value);

    let index = this.state.check_ad.indexOf(value);

    if (index === -1) {
      this.state.check_ad.push(value);
    } else {
      this.state.check_ad.splice(index, 1);
    }

    this.setState({
      check_ad: [...this.state.check_ad],
    });
  }

  handleCheckAll = () => {
    const header = document.getElementsByName("check_box_all");
    const idx = this.state.post.map((post) => {
      return post.idx;
    });

    if (header[0].checked === true) {
      const set = new Set([...this.state.check_ad, ...idx]);

      this.setState({
        check_ad: [...set],
      });
    } else {
      const reduceAd = this.state.check_ad.filter((ad) => {
        return !idx.includes(ad);
      });

      this.setState({
        check_ad: [...reduceAd],
      });
    }
  };

  handleCheckAdDelete = async () => {
    if (this.state.check_ad.length > 0) {
      const checkAd = this.state.check_ad;

      checkAd.forEach((AdIdx) => {
        axios
          .delete("/AdbApi", { params: { adbIdx: AdIdx } })
          .then((response) => {});
      });

      const filterIdx = this.state.post.filter((post) => {
        if (checkAd.indexOf(post.idx) === -1) {
          return true;
        }
      });

      this.setState({
        post: [...filterIdx],
      });
    }
  };

  async handleDelete(e) {
    const { value } = e.target;

    let check_ad = this.state.posts[value];
    if (value) {
      check_ad = value;
    }
    // console.log(check_ad)
    /* axios.delete("/VideoApi", { params: { video_idx: check_ad } }).then((response) => {
      alert("삭제 완료");
      window.location.reload(); //새로고침
    }); */
  }

  render() {
    const ai_connection = ["대기", "완료"];
    const category_list = ["A타입", "B타입", "C타입", "D타입", "고정광고"];
    const week = new Array("일", "월", "화", "수", "목", "금", "토");

    const show_count = 10;
    const page_count = 5;

    const video_list = this.state.post.map((menu, key) => (
      <tr key={key}>
        <td>
          <input
            type="checkbox"
            id={"list" + menu.idx}
            name="check_box"
            value={menu.idx}
            onClick={(e) => this.handleCheck(e, menu.transmission_status)}
            checked={this.state.check_ad.indexOf(menu.idx) !== -1}
          />
          <label for={"list" + menu.idx}>
            <span></span>
          </label>
        </td>
        <td>{menu.idx}</td>
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
        <td>{category_list[menu.type]}</td>
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
        <td>{menu.fk_user_idx ? menu.fk_user_idx : "알수없음"}</td>
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
        <Managenav mode="editing" menu="광고" sub_menu="광고 관리"></Managenav>
        <section className="content">
          <h1 className="title">광고 관리</h1>
          <Search
            searchMode="adb_list"
            onSearchValue={this.onChangeAdbList.bind(this)}
          />
          <div className="video_list">
            <div>
              <h1>광고목록 및 상세검색</h1>
              {this.state.check_ad.length > 0 ? (
                <span>선택 {this.state.check_ad.length}개</span>
              ) : (
                <span>
                  전체{" "}
                  {this.state.posts.length > 0 ? this.state.posts.length : 0} 개
                </span>
              )}
              <button
                onClick={this.handleCheckAdDelete}
                disabled={this.state.check_ad.length <= 0 && "disabled"}
              >
                선택삭제
              </button>
            </div>
            <table className="table-library">
              <colgroup>
                <col width="50px" />
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
                  <th>
                    {
                      <>
                        <input
                          type="checkbox"
                          id="list_check_all"
                          name="check_box_all"
                          onClick={this.handleCheckAll}
                          checked={
                            this.state.post.filter((x) =>
                              this.state.check_ad.includes(x.idx)
                            ).length >= this.state.post.length
                          }
                        />
                        <label for="list_check_all">
                          <span></span>
                        </label>
                      </>
                    }
                  </th>
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
                current_page={this.state.current_page}
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
              <button type="button" onClick={this.adbUpdateOff}>
                X
              </button>
            </h1>
            <DropZone className="dropZone" onDrop={this.onDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: "dropzone" })}>
                  <input
                    accept="image/jpg,image/png,image/jpeg,image/gif"
                    name="img"
                    {...getInputProps()}
                    multiple={false}
                  />
                  <img
                    src={this.state.update_image}
                    alt=""
                    className="video_list_image"
                  />
                </div>
              )}
            </DropZone>
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
                  name="update_agency"
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
