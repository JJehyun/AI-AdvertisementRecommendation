import React, { Component } from "react";
//import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import UserTrashVideo from "./user_trash_video.js";
import UserTrashItem from "./user_trash_item.js";

import axios from "axios";

class UserTrashCan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx: "",
      trash_level: 1,
    };
  }

  level_next(next) {
    this.setState({
      trash_level: next,
    });
  }

  render() {
    return (
      <>
        <div className="user_modify">
          <div className="user_trashcan">
            <h1>
              최근 삭제한 기록
              <span>
                삭제 기록은 최대 7일까지 저장되며, 이후로는 영구삭제됩니다.
              </span>
            </h1>
            <div>
              <ul className="">
                <li>
                  <button
                    type="button"
                    onClick={this.level_next.bind(this, 1)}
                    className={this.state.trash_level == 1 ? "selected" : null}
                  >
                    동영상
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={this.level_next.bind(this, 2)}
                    className={this.state.trash_level == 2 ? "selected" : null}
                  >
                    상품
                  </button>
                </li>
              </ul>
            </div>
            <div>
              {this.state.trash_level === 1 && <UserTrashVideo type="list" />}
              {this.state.trash_level === 2 && <UserTrashItem type="list"/>}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default UserTrashCan;
