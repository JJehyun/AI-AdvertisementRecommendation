import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import Headerprofile from "./components/headerProflies/header_profile";
import Headerballon from "./components/headerProflies/headerballon";
import Direction from "./images/header/Direction.png";
import DirectionUP from "./images/header/DirectionUP.png";
import { getCookie, removeCookie } from "./contents/user/cookies";
import useSWR from "swr";
import { fetchWithToken } from "../fetcher";

const Header = (props) => {
  const { mode } = props;
  const [profileOn, setprofileOn] = useState(false);

  const logout = (e) => {
    let boshow_token = getCookie("boshow_token");
    axios
      .post("/Logout", null, { params: { boshow_token: boshow_token } })
      .then(() => {
        removeCookie("boshow_token");
        props.history.push("/login");
      });
  };

  const UserName = () => {
    // let token = getCookie("boshow_token");
    // var base64Url = token.split(".")[1];
    // var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // var jsonPayload = decodeURIComponent(
    //   atob(base64)
    //     .split("")
    //     .map(function (c) {
    //       return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    //     })
    //     .join("")
    // );
    // console.log(JSON.parse(jsonPayload).name)
    // return JSON.parse("asdas").name;
  };

  if (mode === "login") {
    return (
      <div className="header">
        <div className="Boshow-">Boshow 통합 관리</div>
      </div>
    );
  }

  return (
    <div className="header">
      <div className="Boshow-">
        <Link to="/video_add">Boshow 통합 관리</Link>
      </div>
      <span className="header_mode">
        <Link to="/video_add">
          <button
            type="button"
            className={mode === "editing" ? "selected" : ""}
          >
            편집모드
          </button>
        </Link>

        <Link to="op_dashboard">
          <button
            type="button"
            className={mode === "operation" ? "selected" : ""}
          >
            운영모드
          </button>
        </Link>
      </span>

      <span className="header_user" style={{ display: "flex" }}>
        <Headerprofile UserName={UserName()} />
        <span className="user_name">{UserName()}</span>
        <div style={{ zIndex: 999 }}>
          <img
            onClick={() => {
              setprofileOn(!profileOn);
            }}
            src={profileOn ? Direction : DirectionUP}
            className="headerDirection"
          />
          <div
            className="ballonallow"
            style={{ position: "absolute", right: "65px" }}
          >
            {profileOn ? <Headerballon profile={profileOn} /> : null}
          </div>
        </div>
        <button type="button" className="logout" onClick={logout}>
          로그아웃
        </button>
      </span>
    </div>
  );
};

export default withRouter(Header);
