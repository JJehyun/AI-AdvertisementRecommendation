import React, { Component } from "react";
import axios from "axios";
import Search from "./search.js";
import Pagination from "./pagination.js";
import EditSearchModal from "../contents/edit/edit_search_modal.js";
import { withRouter } from "react-router-dom";
import DropZone from "react-dropzone";

import AlertModal from "../components/alert_modal";
import { getCookie } from "../contents/user/cookies.js";

class ItemContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      post: [],
      posts: [],
      item: [],
      item_tag: [],
      item_cate: [],
      check_item: [],
      current_page: 1,
      update_item: {},
      updateImg: null,
      update_idx: "",
      update_title: "",
      update_thumbnail: "",
      update_price: "",
      update_description: "",
      update_url: "",
      update_tag: "",
      update_category: [],
      modal_writer: "",
      modal_uploadtime: "",
      alertMessage: "",
      searchChek: false,

      // 정보 불러오기
      status: false,
      content: null,
      
      searchTitleRender: "",
      searchTitle: "",
      searchItem: {},
      searchItems: [],

      idx: null,
      title: "",
      description: "",
      price: "",
      url: "",
      tags: "",
      dialogRender: false,

      // 상품명 정렬
      titleCheck: true,

      boshow_token : getCookie("boshow_token"),
      image_path : `${process.env.REACT_APP_BACKEND_HOST}static/item_image/`,
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
          update_thumbnail: render.result,
        });
      };
      render.readAsDataURL(file);
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.itemUpdateOn = this.itemUpdateOn.bind(this);
    this.itemUpdateOff = this.itemUpdateOff.bind(this);
    this.setPost = this.setPost.bind(this);
    this.setAlertMessage =  this.setAlertMessage.bind(this);
    //정보 불러오기
    this.getItemInfo = this.getItemInfo.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.chooseItem = this.chooseItem.bind(this);
    this.loadItem = this.loadItem.bind(this);
  }

  async componentDidMount() {
    this.search();
    axios.get("/ItemApi", null).then((response) => {
      console.log(response.data);
      if (response.status == 200) {
        this.setState({
          posts: response.data,
        });
      }
    });

    axios.get("/ItemTagApi", null).then((response) => {
      console.log(response.data);
      this.setState({
        item_tag: response.data,
      });
    });

    await axios.get("/ItemCategoryApi", null).then((response) => {
      console.log(response.data);
      this.setState({
        item_cate: response.data,
      });
    });

    console.log(this.state.item_cate);

    if (this.state.type === "ai") {
      window.history.pushState("", "", "/ai_make");
    }
    window.onpopstate = (e) => {
      if (this.state.type === "ai") {
        this.props.prevLevel();
      }
    };
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });

    if(name == "update_price") {
      let price = this.comma(this.unComma(value));
      this.setState({[name]: price});
      return
    }

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

  comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }

  unComma = (str) => {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
  }

  handleCheck(e) {
    const value = parseInt(e.target.value);
    let check_item = [...this.state.check_item];

    let index = check_item.indexOf(value);

    if (index === -1) {
      check_item.push(value);
    } else {
      check_item.splice(index, 1);
    }

    if (this.state.type === "ai") {
      let item = [...this.state.item];

      const post = this.state.posts.filter((data) => {
        return data.idx == value;
      })[0];

      if (index === -1) {
        item.push(post);
      } else {
        item.splice(index, 1);
      }

      this.setState({
        item: item,
      });

      this.props.setItem(item);
    }

    this.setState({
      check_item: check_item,
    });
  }

  handleCheckAll = () => {
    const header = document.getElementsByName('all')
    const idx = this.state.post.map((post) => {
      return post.idx
    })

    if (header[0].checked === true) {
      const set = new Set([...this.state.check_item, ...idx]);

      this.setState({
        check_item: [...set],
      })
    }
    else {
      const reduceItem = this.state.check_item.filter(item => {
       return !idx.includes(item);
      })

      this.setState({
        check_item: [...reduceItem]
      })
    }
  }

  handleUpdate() {
    let tags = this.state.update_tag.replace(/(\s*)/g, "");
    tags = tags.split("#");

    if (tags.length === 1 && tags[0] !== "") {
      return alert("태그를 #으로 구분하여 입력해주세요 \n ex)#옷 #바지");
    }
    tags.splice(0, 1);

    var formData = new FormData();
    formData.append("files", this.state.updateImg);
    formData.append("item_idx", this.state.update_item.idx);
    formData.append("title", this.state.update_title);
    formData.append("price", this.state.update_price);
    formData.append("description", this.state.update_description);
    formData.append("url", this.state.update_url);
    formData.append("tag", tags);

    axios({
      method: "put",
      url: "/ItemApi",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      if (!response.data) {
        return alert("해당 상품이 존재하지 않습니다.");
      } else if (response.data === "title") {
        return alert("중복된 이름입니다.");
      }
      alert("수정 완료");
      window.location.reload(); //새로고침
    });
  }

  handlecheckItemDelete = async () => {
    if (this.state.check_item.length > 0) {
      const checkItem = this.state.check_item;

      checkItem.forEach(itemIdx => {
        axios.delete("/ItemApi",
          { params: { item_idx: itemIdx } })
          .then((response) => {
          });
      });

      const filterIdx = this.state.post.filter((post) => {
        if (checkItem.indexOf(post.idx) === -1) {
          return true
        }
      })

      this.setState({
        post: [...filterIdx],
        check_item : []
      })
    }
  }

  async itemUpdateOn(e) {
    const { value } = e.target;

    await this.setState({
      update_item: this.state.post[value],
    });

    let tags = [];
    this.state.item_tag.filter((data) => {
      if (data.fk_item_idx == this.state.update_item.idx) {
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

    if (this.state.update_item) {
      this.setState({
        update_idx: this.state.update_item.idx,
        update_title: this.state.update_item.title,
        update_thumbnail:
          `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
          this.state.update_item.idx +
          "/item_1.jpg",
        update_price: this.state.update_item.price,
        update_description: this.state.update_item.description,
        update_url: this.state.update_item.url,
        update_tag: tag,
        modal_writer: this.state.update_item.user_name,
        modal_uploadtime: this.state.update_item.upload_time,
      });
      
      //카테고리
      let category = "";
      let level_0 = this.state.update_item.fk_category_level0;
      let level_1 = this.state.update_item.fk_category_level1;
      let level_2 = this.state.update_item.fk_category_level2;
      let level_3 = this.state.update_item.fk_category_level3;
      if(this.state.item_cate.findIndex((obj) => obj.idx == level_0) != -1) {
        category = "[대분류]" + this.state.item_cate[this.state.item_cate.findIndex((obj) => obj.idx == level_0)].name;
      }
      if(this.state.item_cate.findIndex((obj) => obj.idx == level_1) != -1) {
        category = category + ">[중분류]" + this.state.item_cate[this.state.item_cate.findIndex((obj) => obj.idx == level_1)].name;
      }
      if(this.state.item_cate.findIndex((obj) => obj.idx == level_2) != -1) {
        category = category + ">[소분류]" + this.state.item_cate[this.state.item_cate.findIndex((obj) => obj.idx == level_2)].name;
      }
      if(this.state.item_cate.findIndex((obj) => obj.idx == level_3) != -1) {
        category = category + ">[상세분류]" + this.state.item_cate[this.state.item_cate.findIndex((obj) => obj.idx == level_3)].name;
      }
      this.setState({update_category: category});
    }
  }

  itemUpdateOff() {
    this.setState({
      update_item: {},
      update_idx: "",
      update_title: "",
      update_thumbnail: "",
      update_price: "",
      update_description: "",
      update_url: "",
      update_category: "",
      // update_tag: '',
    });
  }

  onChangeItemList(data, page) {
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

  setSearchCheck = (value) => {
    this.setState({
      searchChek: value
    })
  }

  setAlertMessage(message) {
    this.setState({
      alertMessage : message
    });
  }

  searchedResult = () => {
    const isSearched = this.state.searchChek;
    const checkedItem = this.state.check_item.length;
    const searchedItem = this.state.posts.length;

    if(isSearched) {
      // (검색 결과가 없음) || (검색결과 검색 결과가 없지만 상품 선택)
      if((searchedItem == 0) || (searchedItem > 0 && checkedItem <= 0)){
        return `${searchedItem}개가 검색 되었습니다`;
      } else {
        return `선택 ${checkedItem}개 되었습니다`;
      }
    } else {
      if(checkedItem > 0){
        return `선택 ${checkedItem}개 되었습니다`;
      } else {
        return `전체 ${searchedItem}개 `;
      }
    }
  }

  // 중복 확인
  checkTitle = () => {
    axios
      .get("/ItemApi", { params: { title: this.state.update_title } })
      .then((response) => {
        if (response.data) {
          console.log("response.data", response.data)
          if (response.data.length > 0 && this.state.update_title !== this.state.searchItem.title) {
              this.setAlertMessage("이미 존재하는 상품명입니다.");
            } else {
              this.setAlertMessage("중복되는 상품명이 없습니다.계속 진행하고 싶다면 확인버튼을 눌러주세요.");
            }
        }
      });
  };

  getUploadTime = (str, type) => {
    const week = new Array("일", "월", "화", "수", "목", "금", "토");
    if(type === "date") {
      let date = String(str).substring(0, 4) +
                "-" +
                String(str).substring(5, 7) +
                "-" +
                String(str).substring(8, 10) +
                "-" +
                week[new Date(str).getDay()] +
                " ";
      return date;
    } else if(type === "time") {
      let time = String(str).substring(11, 13) +
                ":" +
                String(str).substring(14, 16) +
                ":" +
                String(str).substring(17, 19);
      return time;
    }
  }

  getItemInfo() {
    this.setState({ status: true });
  };

  closeModal() {
    this.setState({ status: false });
  };

  search = () => {
    axios
      .get("/ItemApi", {
        params: { boshow_token: this.state.boshow_token, title: this.state.searchTitle },
      })
      .then((response) => {
        this.setState ({
          searchTitleRender : this.state.searchTitle,
          searchItems: response.data,
        });
      });
  };

  chooseItem = (e) => {
    const { value } = e.target;

    const load_item = document.getElementsByName("load_item");
    load_item.forEach((item) => {
      item.checked = false;
    });
    e.target.checked = true;

    this.setState({searchItem : this.state.searchItems[value]});
  };

  loadItem = async () => {
    if (Object.keys(this.state.searchItem).length > 0) {
      let tag = "";
      let hash = "#";
      await axios
        .get("/ItemTagApi", { params: { item_idx: this.state.searchItem.idx } })
        .then((response) => {
          response.data.filter((data, key) => {
            if (key == 1) {
              hash = " #";
            }
            tag = tag + hash + data.tag;
          });
        });

      let now_select_idx = 0;
      let now_select_level = 0;
      let category = 0;
      for (let i = 0; i < 4; i++) {
        category = this.state.searchItem["fk_category_level" + String(i)];
        if (category == 0) {
          break;
        }
        now_select_idx = category;
        now_select_level++;
      }
      now_select_level--;

        this.setState({
          update_thumbnail: this.state.image_path + String(this.state.searchItem.idx) + "/item_1.jpg",
          update_idx: this.state.searchItem.idx,
          update_title: this.state.searchItem.title,
          update_description: this.state.searchItem.description,
          update_price: this.state.searchItem.price,
          update_url: this.state.searchItem.url,
          update_tag: tag,
          fk_category_idx: {
            level_0: this.state.searchItem.fk_category_level0,
            level_1: this.state.searchItem.fk_category_level1,
            level_2: this.state.searchItem.fk_category_level2,
            level_3: this.state.searchItem.fk_category_level3,
            now_select_idx: now_select_idx,
            now_select_level: now_select_level,
          },
        })
    }

    this.closeModal();
  };

  sortItem = () => {
    const items = this.state.posts;

    if (this.state.titleCheck) {
      // 가나다순 (한글 > 영어 > 숫자 > 특수기호) 정렬
      const sortItems = this.sortAsTitle(items);

      this.setState({
        posts: [...sortItems],
      });
    } else {
      // 최신순 정렬
      const sortItems = items.sort((a, b) => {
        return new Date(b.upload_time) - new Date(a.upload_time);
      });

      this.setState({
        posts: [...sortItems],
      });
    }

    this.setState({
      titleCheck: !this.state.titleCheck,
    });
  }

  sortAsTitle(arr) {
    const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
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

  render() {
    const ai_connection = ["미연결", "연결"];
    //const user_idx = this.parseJwt(this.state.boshow_token)["idx"];

    const show_count = 10;
    const page_count = 5;


    const isSearched = this.state.searchChek;
    const checkedItem = this.state.check_item.length;
    const searchedItem = this.state.posts.length;


    const item_list = this.state.post.map((menu, key) => (
      <tr
        key={menu.idx}
        className={
          this.state.check_item.indexOf(menu.idx) !== -1 ? "selected" : ""
        }
      >
        <td>
          <input
            type="checkbox"
            id={"list" + menu.idx}
            name="check_box"
            value={menu.idx}
            onClick={this.handleCheck}
            checked={this.state.check_item.indexOf(menu.idx) !== -1}
          />
          <label for={"list" + menu.idx}>
            <span></span>
          </label>
        </td>
        <td>{menu.idx}</td>
        <td>
          <img
            src={
              `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
              menu.idx +
              "/item_1.jpg"
            }
            alt=""
            className="video_list_image"
          ></img>
          <span className="list_description">
            <p>{menu.title}</p>
            <p className="video_list_explanation">{menu.description}</p>
          </span>
        </td>
        <td className="item_list_category">
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
        <td>{menu.price}원</td>
        <td>{ai_connection[menu.ai_connection]}</td>
        {/* <td>판매상태</td> */}
        <td>
          <p>{this.getUploadTime(menu.upload_time, "date")}</p>
          <p>{this.getUploadTime(menu.upload_time, "time")}</p>
        </td>
        <td>{menu.user_name}</td>
        <td>
          {this.state.type !== "ai" && (
            <button
              type="button"
              value={key}
              className="search_list_update_btn"
              onClick={this.itemUpdateOn}
            >
              수정
            </button>
          )}
        </td>
        </tr>
    ));

    return (
      <>
        <Search
          searchMode="item_list"
          onSearchValue={this.onChangeItemList.bind(this)}
          isSearched={this.setSearchCheck}
        />
        <div className="video_list">
          <div>
            <h1>상품 목록 및 상세검색</h1>
            <span>{this.searchedResult()}</span>
            {this.state.type === "list" &&
              <button onClick={this.handlecheckItemDelete} disabled={this.state.check_item.length <= 0 && 'disabled'}>선택삭제</button>}
          </div>
          <table className="table-library">
            <colgroup>
              <col width="50px" />
              <col width="50px" />
              <col width="200px" />
              <col width="100px" />
              <col width="100px" />
              <col width="100px" />
              <col width="100px" />
              <col width="100px" />
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
                        name="all"
                        onClick={this.handleCheckAll}
                        checked={this.state.post.filter(x => this.state.check_item.includes(x.idx)).length >= this.state.post.length}
                      />
                      <label for="list_check_all">
                        <span></span>
                      </label>
                    </>
                  )}
                </th>
                <th>번호</th>
                <th onClick={this.sortItem} style={{cursor:"pointer"}}>
                  {this.state.titleCheck ? "상품명 ↓" : "상품명  ↑"}
                </th>
                <th>카테고리</th>
                <th>판매가</th>
                <th>AI 연결</th>
                <th>날짜</th>
                <th>등록자</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{item_list}</tbody>
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
        {this.state.update_item.idx ? (
          <div className="item_update">
            <h1>
              상품 수정
              <button type="button" onClick={this.itemUpdateOff}>
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
                    src={this.state.update_thumbnail}
                    alt=""
                    className="video_list_image"
                  />
                </div>
              )}
            </DropZone>
            <ul>
              <li>
                정보 불러오기
                <button
                  type="button"
                  className="item_add_load_btn"
                  onClick={this.getItemInfo}
                >
                  상품정보 불러오기
                </button>
              </li>
              <li>상품명</li>
              <li>
                <input
                  type="text"
                  name="update_title"
                  onChange={this.handleChange}
                  value={this.state.update_title}
                  style={{width:"74%"}}
                />
                <button
                  type="button"
                  style={this.state.update_title.length > 0 
                    ? { backgroundColor: '#7c38ff' } : {}}
                  onClick={this.checkTitle}
                  disabled={this.state.update_title ? false : true}
                  >
                  중복확인
                </button>
              </li>
              <li>판매가</li>
              <li>
                <input
                  type="text"
                  name="update_price"
                  onChange={this.handleChange}
                  value={this.state.update_price}
                  style={{width:"90%", marginRight:"5px"}}
                />원
              </li>
              <li>상품특징</li>
              <li>
                <input
                  type="text"
                  name="update_description"
                  onChange={this.handleChange}
                  value={this.state.update_description}
                />
              </li>
              <li>URL</li>
              <li>
                <input
                  type="text"
                  name="update_url"
                  onChange={this.handleChange}
                  value={this.state.update_url}
                />
              </li>
              <li>카테고리</li>
              <li>
                <input
                  type="text"
                  name="update_category"
                  onChange={this.handleChange}
                  value={this.state.update_category}
                />
              </li>
              <li>상품 태그</li>
              <li>
                <input
                  type="text"
                  name="update_tag"
                  onChange={this.handleChange}
                  value={this.state.update_tag}
                  placeholder="#태그 #태그"
                />
                {/* value={this.state.update_tag} */}
              </li>
              <li>날짜 <span>{this.getUploadTime(this.state.modal_uploadtime, "date")} {this.getUploadTime(this.state.modal_uploadtime, "time")}</span></li>
              <li>등록자 <span>{this.state.modal_writer}</span></li>
              <button type="button" onClick={this.handleUpdate}>
                저장
              </button>
            </ul>
          </div>
        ) : null}
        {/* 정보 불러오기 */}
        {this.state.status && (
        <EditSearchModal close={this.closeModal} header="상품정보 불러오기" subTitle="불러오기는 최대 1개 상품만 가능합니다." >
          <div>
            <main> {this.props.children} </main>
            <div>
              {this.state.searchTitleRender && (
                <div className="searchNotice">
                  <span>'{this.state.searchTitleRender}'</span>를 포함한 <span>'{this.state.searchItems.length}개'</span> 상품이 검색 되었습니다.
                </div>
              )}

              <div className="search">
                <input
                  name=""
                  type="text"
                  onChange={(e) => this.setState({searchTitle : e.target.value})}
                  placeholder="이름을 입력해주세요"
                />
                <button type="button" onClick={this.search}>
                  검색
                </button>
              </div>

              <div className="result">
                <ul>
                  <li />
                  <li>상품 이미지</li>
                  <li>상품명</li>
                  <li>카테고리</li>
                  <li>가격 및 상품정보</li>
                  {/* <li>카테고리</li> */}
                </ul>
                <table>
                  <colgroup>
                    <col width="6%" />
                    <col width="16%;" />
                    <col width="20%;" />
                    <col width="34%;" />
                    {/* <col width="24%;"/> */}
                  </colgroup>
                  {this.state.searchItems.map((item, key) => (
                    <tr key={key}>
                      <td>
                        <input
                          type="checkbox"
                          name="load_item"
                          id={"load_item_" + item.idx}
                          className="get_item_info"
                          value={key}
                          onClick={this.chooseItem}
                        />
                        <label for={"load_item_" + item.idx}>
                          <span />
                        </label>
                        {/* <input type="checkbox" id={"list" + menu.idx} name="idx" value={menu.idx} onClick={this.handleCheck} checked={this.state.check_video.indexOf(menu.idx) !== -1}/>
                                                <label for={"list" + menu.idx}><span></span></label> */}
                      </td>
                      <td>
                        <img
                          src={
                            `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
                            String(item.idx) +
                            "/item_1.jpg"
                          }
                        />
                      </td>
                      <td className="title">{item.title}</td>
                      <td>
                        {
                          <td className="item_list_category">
                            {this.state.item_cate.findIndex(
                              (obj) => obj.idx == item.fk_category_level0
                            ) !== -1 ? (
                              <>
                                [대분류]
                                {
                                  this.state.item_cate[
                                    this.state.item_cate.findIndex(
                                      (obj) => obj.idx == item.fk_category_level0
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                            {this.state.item_cate.findIndex(
                              (obj) => obj.idx == item.fk_category_level1
                            ) !== -1 ? (
                              <>
                                &gt; [중분류]
                                {
                                  this.state.item_cate[
                                    this.state.item_cate.findIndex(
                                      (obj) => obj.idx == item.fk_category_level1
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                            {this.state.item_cate.findIndex(
                              (obj) => obj.idx == item.fk_category_level2
                            ) !== -1 ? (
                              <>
                                &gt; [소분류]
                                {
                                  this.state.item_cate[
                                    this.state.item_cate.findIndex(
                                      (obj) => obj.idx == item.fk_category_level2
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                            {this.state.item_cate.findIndex(
                              (obj) => obj.idx == item.fk_category_level3
                            ) !== -1 ? (
                              <>
                                &gt; [상세분류]
                                {
                                  this.state.item_cate[
                                    this.state.item_cate.findIndex(
                                      (obj) => obj.idx == item.fk_category_level3
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                          </td>
                        }
                      </td>
                      <td>
                        가격 : {item.price}원<br />
                        상품특징 : {item.description}
                        <br />
                        URL : {item.url}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>

              <div className="btn_line">
                <button type="button" onClick={this.loadItem}>
                  불러오기
                </button>
              </div>
            </div>
          </div>
        </EditSearchModal>
      )}
        <AlertModal message={this.state.alertMessage} setMessage={this.setAlertMessage}/>
      </>
    );
  }
}

export default withRouter(ItemContainer);
