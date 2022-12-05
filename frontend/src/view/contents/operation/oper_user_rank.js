import React, { Component } from "react";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";
import axios from "axios";
import Pagination from "../../components/pagination";

// import { Link } from "react-router-dom";

class OpUserRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      posts: [],
      post: [],
      modifyTier: [],
      show_count: 10,
      page_count: 5,
      current_page: 1,
    };
    this.userList.bind(this);
    this.userList();
    this.setPost = this.setPost.bind(this);
  }

  userList() {
    try {
      axios
        .get("/UserApi", null, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          this.setState({
            posts: response.data,
            tier_value: null,
            status_value: null,
          });
        }) // SUCCESS
        .catch((response) => {
          console.log(response);
        }); // ERROR
    } catch (e) {
      console.log(e);
    }
  }

  handleChangeTier(menu) {
    var user_idx = menu.idx;
    var idt = document.getElementById(user_idx + "_select_tier");
    var ids = document.getElementById(user_idx + "_select_status");
    var select_tier = idt.options[idt.selectedIndex].value;
    var select_status = ids.options[ids.selectedIndex].value;
    if (this.state.modifyTier.some((mody) => mody.user_idx == menu.idx)) {
      var index = this.state.modifyTier.findIndex(
        (i) => i.user_idx == menu.idx
      );
      var updateModify = Array.from(this.state.modifyTier);
      updateModify[index] = {
        user_idx: menu.idx,
        tier: select_tier,
        status: select_status,
      };
      this.setState({
        [menu.idx + "_select_tier"]: select_tier,
        modifyTier: updateModify,
      });
    } else {
      var modifyCh = {
        user_idx: menu.idx,
        tier: select_tier,
        status: select_status,
      };
      this.setState({
        [menu.idx + "_select_tier"]: select_tier,
        modifyTier: this.state.modifyTier.concat(modifyCh),
      });
    }
  }

  handleChangeStatus(menu) {
    var user_idx = menu.idx;
    var idt = document.getElementById(user_idx + "_select_tier");
    var ids = document.getElementById(user_idx + "_select_status");
    var select_tier = idt.options[idt.selectedIndex].value;
    var select_status = ids.options[ids.selectedIndex].value;
    if (this.state.modifyTier.some((mody) => mody.user_idx == menu.idx)) {
      var index = this.state.modifyTier.findIndex(
        (i) => i.user_idx == menu.idx
      );
      var updateModify = Array.from(this.state.modifyTier);
      updateModify[index] = {
        user_idx: menu.idx,
        tier: select_tier,
        status: select_status,
      };
      this.setState({
        [menu.idx + "_select_status"]: select_status,
        modifyTier: updateModify,
      });
    } else {
      var modifyCh = {
        user_idx: menu.idx,
        tier: select_tier,
        status: select_status,
      };
      this.setState({
        [menu.idx + "_select_status"]: select_status,
        modifyTier: this.state.modifyTier.concat(modifyCh),
      });
    }
  }

  saveUserRank = (e) => {
    e.preventDefault();
    var modify_list = this.state.modifyTier;
    console.log(modify_list);
    this.data = {
      modify_list: modify_list,
    };
    axios
      .post(
        "/UserApi",
        null,
        { params: this.data },
        { headers: { "content-type": "application/json" } }
      )
      .then((response) => {
        if (response.status == 200) {
          this.props.history.push("/op_user_rank");
          alert("저장 되었습니다.");
        }
      }) // SUCCESS
      .catch((response) => {
        console.log(response);
      }); // ERROR
  };

  setPost(page) {
    this.setState({
      post: this.state.posts.slice((page - 1) * 10, page * 10),
      current_page: page,
    });
  }

  render() {
    const user_list = this.state.post.map((menu) => (
      <tr key={menu.idx} className="">
        <td>{menu.name}</td>
        <td>{menu.id}</td>
        {menu.phone ? (
          <td>
            {String(menu.phone).slice(0, 3)}-{String(menu.phone).slice(3, 7)}-
            {String(menu.phone).slice(7, 11)}
          </td>
        ) : (
          <td></td>
        )}

        <td>{menu.dept}</td>
        <td>
          <select
            id={menu.idx + "_select_tier"}
            value={
              this.state[menu.idx + "_select_tier"] != undefined
                ? this.state[menu.idx + "_select_tier"]
                : menu.tier
            }
            onChange={this.handleChangeTier.bind(this, menu)}
          >
            <option value={1}>스태프</option>
            <option value={2}>마스터</option>
          </select>
        </td>
        <td>
          <select
            id={menu.idx + "_select_status"}
            value={
              this.state[menu.idx + "_select_status"] != undefined
                ? this.state[menu.idx + "_select_status"]
                : menu.status
            }
            onChange={this.handleChangeStatus.bind(this, menu)}
          >
            <option value="">상태</option>
            <option value="0">대기</option>
            <option value="1">정상</option>
          </select>
        </td>
      </tr>
    ));
    return (
      <>
        <Header mode="operation"></Header>
        <Managenav
          mode="operation"
          menu="관리"
          sub_menu="권한 설정"
        ></Managenav>
        <section className="content">
          <h1 className="title">
            권한설정
            <button
              type="button"
              className="user_rank_save"
              onClick={this.saveUserRank}
            >
              저장
            </button>
          </h1>
          <div className="video_add user_rank_frame">
            <table className="user_rank">
              <colgroup>
                <col width="5.8%" />
                <col width="27.5%" />
                <col width="27.5%" />
                <col width="27.5%" />
                <col width="5.8%" />
                <col width="5.8%" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>아이디</th>
                  <th>휴대전화</th>
                  <th>부서</th>
                  <th>등급</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>{user_list}</tbody>
            </table>
          </div>
          {this.state.posts.length > 0 && (
            <div style={{ paddingRight: "20rem" }}>
              <Pagination
                posts={this.state.posts}
                show_count={this.state.show_count}
                page_count={this.state.page_count}
                current_page={this.state.current_page}
                setPost={this.setPost}
              />
            </div>
          )}
        </section>
      </>
    );
  }
}

export default OpUserRank;
