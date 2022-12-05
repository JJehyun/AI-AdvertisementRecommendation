import React, { Component, useRef, useState } from "react";
import {
  smallgrayT,
  smallgrayT2,
  smallblackT,
  smallblackT2,
  titletext,
  textbox,
  textbox2,
} from "./styled";

const VideosModal = (props) => {
  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
  console.log(props.videodetail);
  console.log(props.videotag);
  //요일 구하기!
  const gettoday = () => {
    const uploaddayone = props.videodetail.upload_time;
    const uploadday = props.videodetail.upload_time.split("T", 1);
    var week = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    var today = new Date(uploadday).getDay();
    var todayLabel = week[today];
    const timetext = uploaddayone.replace("T", todayLabel);
    return timetext;
  };
  //모달 닫기
  const closemodal = () => {
    props.closemodal();
  };
  //태그 가져오기
  const gettag = (idx) => {
    let array = [];
    let list = props.videotag;
    let tag = list.filter(function (list) {
      return list.fk_video_idx == idx;
    });
    for (let i = 0; i < tag.length; i++) {
      let text = "#" + tag[i].tag;
      array.push(text);
    }
    return array;
  };
  //동영상 시간 변환하기
  const gettime = () => {
    let seconds = props.videodetail.duration;
    var hour, min, sec;
    hour = parseInt(seconds / 3600);
    min = parseInt((seconds % 3600) / 60);
    sec = seconds % 60;
    if (hour.toString().length == 1) hour = "0" + hour;
    if (min.toString().length == 1) min = "0" + min;
    if (sec.toString().length == 1) sec = "0" + sec;
    return hour + ":" + min + ":" + sec;
  };
  //유뷰브 영상 가져오기
  const youtube = () => {
    let src = props.videodetail.url;
    let source = src.replace("/watch?v=", "/embed/");
    return source;
  };
  return (
    <>
      <div
        style={{ marginTop: "35px", marginLeft: "15px", marginRight: "15px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1
            onClick={() => {
              const uploadday = props.videodetail.upload_time.split("T", 1);
              console.log(uploadday);
            }}
            style={{ fontSize: "28px", fontWeight: "600" }}
          >
            동영상 수정
          </h1>
          <h1
            onClick={closemodal}
            style={{ fontSize: "28px", fontWeight: "600", cursor: "pointer" }}
          >
            X
          </h1>
        </div>
        {/*동영상 부분!*/}
        <div style={{ marginTop: "30px" }}>
          {props.videodetail.platform === "직접 업로드" ? (
            <video
              controls
              loop
              width="310px"
              src={
                image_path + "videos/" + String(props.videodetail.idx) + ".mp4"
              }
              alt=""
              className="video_list_image"
              autoplay="autoplay"
            />
          ) : (
            <iframe
              width="310px"
              src={youtube()}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          )}
        </div>
        {/*설명 부분*/}
        <div
          style={{
            height: "80px",
            width: "310px",
            border: "1px solid #cbcbcb",
            borderTop: "none",
            backgroundColor: "#f7f7f7",
          }}
        >
          <table>
            <tr>
              <th style={smallgrayT}>길이</th>
              <th onClick={gettoday} style={smallgrayT2}>
                날 짜
              </th>
            </tr>
            <tr>
              <th style={smallblackT}>{gettime()}</th>
              <th style={smallblackT2}>{gettoday()}</th>
            </tr>
            <tr>
              <th onClick={gettag()} style={smallgrayT}>
                플랫폼
              </th>
              <th style={smallgrayT2}>등록자</th>
            </tr>
            <tr>
              <th style={smallblackT}>{props.videodetail.platform}</th>
              <th style={smallblackT2}>{props.videodetail.user_name}</th>
            </tr>
          </table>
        </div>
        {/*제목 부분*/}
        <div style={titletext}>제목</div>
        <input
          type="text"
          name="update_title"
          value={props.videodetail.title}
          style={textbox}
        />
        {/*제목 부분 끝*/}
        {/*설명 부분*/}
        <div style={titletext}>설명</div>
        <textarea
          className="video_update_description"
          name="update_description"
          value={props.videodetail.description}
          placeholder="공백 제외 최대 200자 이내로 적어주시길 바라며, 자세히 쓸수록 동영상 관리에 더욱더 편리합니다."
          style={textbox2}
        />
        {/*설명 부분 끝*/}
        {/*태그 부분*/}
        <div style={titletext}>태그</div>
        <input
          type="text"
          name="update_title"
          value={gettag(props.videodetail.idx)}
          style={textbox}
        />
        {/*분류 부분*/}
        <div style={titletext}>분류</div>
        <select
          style={textbox}
          name="update_category"
          value={props.videodetail.category}
        >
          <option value="" disabled selected hidden>
            카테고리 선택
          </option>
          <option value="1">예능</option>
          <option value="2">스포츠/취미</option>
          <option value="3">드라마</option>
          <option value="4">교양</option>
          <option value="5">애니메이션</option>
          <option value="6">키즈</option>
          <option value="0">기타</option>
        </select>
      </div>
    </>
  );
};
export default VideosModal;
