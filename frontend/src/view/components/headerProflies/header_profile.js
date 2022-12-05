import React, { useState } from "react";
import headeralerm from "../../images/header/header_alarm.png";
import searchN from "../../images/header/icon_search_h.png";
import Ballon from "./headerballon";
import axios from "axios";
import {
  borderstyle,
  alermIMGstyle,
  headerSearchBox,
  searchIMGstyle,
  profileIMG,
} from "./ProfileStyle";
import { getCookie } from "../../contents/user/cookies";
import useSWR from "swr";
import { fetchWithToken } from "../../../fetcher";

const Headerprofile = (props) => {
  const [Alarmon, setAlarmon] = useState(false);

  const { data: userInfo, error } = useSWR(
    ["/FindUserDetails", getCookie("boshow_token")],
    fetchWithToken
  );

  const userImageSrc = () => {
    if (userInfo && userInfo.user_image) {
      return (
        `${process.env.REACT_APP_BACKEND_HOST}static/users/` +
        userInfo.id +
        "IMG" +
        userInfo.user_image +
        ".jpg"
      );
    } else {
      return `${process.env.REACT_APP_BACKEND_HOST}static/users/null.jpg`;
    }
  };

  return (
    <div style={borderstyle}>
      <div style={{ zIndex: 999 }}>
        <img
          style={alermIMGstyle}
          src={headeralerm}
          onClick={() => {
            setAlarmon(!Alarmon);
          }}
        />
        <div
          className="ballonallowtwo"
          style={{ position: "absolute", right: "600px" }}
        >
          {Alarmon ? <Ballon Alarm={Alarmon} /> : null}
        </div>
      </div>
      <div className="headerinputbox" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="카테고리,기능 등을 검색하세요."
          style={headerSearchBox}
        ></input>
        <img src={searchN} style={searchIMGstyle} />
      </div>
      <img src={userImageSrc()} style={profileIMG}></img>
    </div>
  );
};
export default Headerprofile;
