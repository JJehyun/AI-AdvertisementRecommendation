import React, { useState } from "react";
import axios from "axios";
import {
  ballonborder,
  ballonfontstyle,
  ballonLine,
  ballonAlarmtext,
  ballonprofilenametext,
  ballonprofileidtext,
  ballonprofileimgs,
  ballonprofileTopbox,
  ballonrelativeBox,
} from "./ProfileStyle";
import { Link } from "react-router-dom";
import { getCookie } from "../../contents/user/cookies";
import useSWR from "swr";
import { fetchWithToken } from "../../../fetcher";

//user name 가져오기
const Headerballon = (props) => {
  const { data: userInfo, error } = useSWR(
    ["/FindUserDetails", getCookie("boshow_token")],
    fetchWithToken
  );

  //user id 가져오기
  const userImageSrc = () => {
    if (userInfo.user_image) {
      return (
        `${process.env.REACT_APP_BACKEND_HOST}static/users/` +
        userInfo.id +
        "IMG" +
        userInfo.user_image +
        ".jpg"
      );
    } else {
      return (
        `${process.env.REACT_APP_BACKEND_HOST}static/users/` +
        userInfo.user_image +
        ".jpg"
      );
    }
  };

  return (
    <div style={ballonborder}>
      {/*header bar에서 profile 버튼 눌렀을 때*/}
      {props.profile ? (
        <>
          <div
            className="profile"
            style={{ height: "60px", backgroundColor: "white" }}
          >
            <div style={ballonprofileTopbox}>
              <img
                src={userImageSrc()}
                alt={userInfo.user_image}
                style={ballonprofileimgs}
              ></img>
              <div style={ballonrelativeBox}>
                <div style={ballonprofilenametext}>{userInfo.name}</div>
                <div style={ballonprofileidtext}>{userInfo.id}</div>
              </div>
            </div>
          </div>
          <div style={ballonLine}></div>
          <Link
            to={{
              pathname: "/user_settings",
              state: { mode: "editing", level: 1 },
            }}
            style={ballonfontstyle}
          >
            계정 설정
          </Link>
          <Link
            to={{
              pathname: "/user_settings",
              state: { mode: "editing", level: 2 },
            }}
            style={ballonfontstyle}
          >
            알람 설정
          </Link>
        </>
      ) : null}
      {/*header bar에서 Alarm 버튼 눌렀을 때*/}
      {props.Alarm ? (
        <>
          <div className="profile" style={ballonAlarmtext}>
            알림
          </div>
          <div style={ballonLine}></div>
          <div style={ballonfontstyle}>테스트 1</div>
          <div style={ballonfontstyle}>테스트 2</div>
        </>
      ) : null}
    </div>
  );
};
export default Headerballon;
