import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

import axios from "axios";
import { getCookie } from "../user/cookies"
import ic_search_white from "../../images/common/icons/ic_search_white.png";

class UserTrashItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      posts: [],
      title: "",
      item_cate: [],
      idx: "",
    };
    this.selectedItem = [];
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.itemUrl = this.itemUrl.bind(this);
  }

  itemUrl() {
    axios
      .get("/ItemApi", {
        params: {
          boshow_token: getCookie("boshow_token"),
          mode: "trash",
        },
      })
      .then((response) => {
        if (response.status == 200) {
          this.selectedItem.splice(0);
          this.setState({
            posts: response.data,
            title: "",
          });
        }
      });
  }

  async componentDidMount() {
    this.itemUrl();

    await axios.get("/ItemCategoryApi", null).then((response) => {
      this.setState({
        item_cate: response.data,
      });
    });

    console.log(this.state.item_cate);
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
        "/ItemSearchApi",
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
    if (this.selectedItem.length !== 0) {
      this.data = {
        mode: "recovery",
        user_idx: this.selectedItem[0].user_idx,
        Sitem: this.selectedItem,
      };
      axios.put("/ItemApi", null, { params: this.data }).then((response) => {
        this.itemUrl();
        const check_item = document.getElementsByName("choose_item");
        check_item.forEach((adb) => {
          adb.checked = false;
        });
      });
      return;
    } else {
      alert("복구할 상품을 선택해주세요!");
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
      this.selectedItem = [];
      idx.map(item_idx => {
        this.selectedItem.push({ idx: item_idx, user_idx: user_idx });
        this.setState({ idx: idx});
      })
    }
    else {
      this.selectedItem = [];
      idx.map(item_idx => {
        this.setState({ idx: item_idx});
      })
    }
  }

  checkChange(item, e) {
    if (e.target.checked) {
      this.selectedItem.push({ idx: item.idx, user_idx: item.fk_user_idx });

      this.setState({
        idx : e.target.value,
      });
    } else {
      this.selectedItem.splice(
        this.selectedItem.findIndex((obj) => obj.idx === item.idx), 1
      );

      this.setState({
        idx : e.target.value,
      });
    }
  }

  render() {
    const week = new Array("일", "월", "화", "수", "목", "금", "토");
    const item_img = `${process.env.REACT_APP_BACKEND_HOST}static/item_image/`;
    const item_list = this.state.posts.map((menu, key) => (
      <tr key={key} className={this.selectedItem.findIndex(item => item.idx == menu.idx) !== -1 ? "selected" : ""}>
        <td>
          <input
            type="checkbox"
            id={"list" + menu.idx}
            name="idx"
            name="choose_item"
            value={menu.idx}
            onChange={this.checkChange.bind(this, menu)}
            checked={this.selectedItem.findIndex(item => item.idx == menu.idx) !== -1}
          />
          <label for={"list" + menu.idx}>
            <span></span>
          </label>
        </td>
        <td>{menu.idx}</td>
        <td className="menu_title">
          <img src={item_img+menu.idx+'/item_1.jpg'} alt="" className="item_list_image" style={{width:"75px"}}/>
          <span className="list_description">
            <p>{menu.title}</p>
            <p>{menu.description}</p>
          </span>
        </td>
        <td>
          {this.state.item_cate.findIndex(
            (obj) => obj.idx == menu.fk_category_level0
          ) != -1 ? (
            <>
              [대분류]
              {
                this.state.item_cate[
                  this.state.item_cate.findIndex(
                    (obj) => obj.idx == menu.fk_category_level0
                  )
                ].name
              }
            </>
          ) : null}
          {this.state.item_cate.findIndex(
            (obj) => obj.idx == menu.fk_category_level1
          ) != -1 ? (
            <>
              &gt; [중분류]
              {
                this.state.item_cate[
                  this.state.item_cate.findIndex(
                    (obj) => obj.idx == menu.fk_category_level1
                  )
                ].name
              }
            </>
          ) : null}
          {this.state.item_cate.findIndex(
            (obj) => obj.idx == menu.fk_category_level2
          ) != -1 ? (
            <>
              &gt; [소분류]
              {
                this.state.item_cate[
                  this.state.item_cate.findIndex(
                    (obj) => obj.idx == menu.fk_category_level2
                  )
                ].name
              }
            </>
          ) : null}
          {this.state.item_cate.findIndex(
            (obj) => obj.idx == menu.fk_category_level3
          ) != -1 ? (
            <>
              &gt; [상세분류]
              {
                this.state.item_cate[
                  this.state.item_cate.findIndex(
                    (obj) => obj.idx == menu.fk_category_level3
                  )
                ].name
              }
            </>
          ) : null}
        </td>
        <td>{menu.price}</td>
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
                <col width="20%" />
                <col width="10%" />
                <col width="35%" />
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
                          checked={this.selectedItem.length === this.state.posts.length}
                        />
                        <label for="list_check_all">
                          <span></span>
                        </label>
                      </>
                    )}
                  </th>
                  <th>번호</th>
                  <th>상품명</th>
                  <th>카테고리</th>
                  <th>판매가</th>
                  <th>날짜</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {item_list.length !== 0 ? (
                  item_list
                ) : (
                  <tr>
                    <td colSpan="7" className="trashcan_no_item">
                      삭제하신 상품이 존재하지 않습니다.
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
export default UserTrashItem;
