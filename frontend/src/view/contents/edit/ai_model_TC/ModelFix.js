import React, { useState, useEffect } from "react";
import VideoBox from "./videobox";
import ChoiceBOX from "./choicebox";
import TableTC from "./tableTC";
import AiSubmit from "../../edit/ai_submit";
import {
  mainBOX,
  maintopBOX,
  mainseleText,
  mainbottomBOX,
  mainblackLine,
  submitButton,
} from "./styles";

const ModelFix = ({ video, item }) => {
  const [submitModal, setSubmitModal] = useState(false);
  const [selectBox, setselectBox] = useState(0);
  const [list, setlist] = useState([]); //전체 함수

  const handleSubmit = (e) => {
    if(list.length == 0)
      return
    setSubmitModal(!submitModal);
  };

  //자동TC INPUT BOX에서 선택한 숫자
  const number = (choice) => {
    setselectBox(choice);
  };
  
  const addList = (addlist) => {
    let arr = [...list];
    arr.push(addlist);
    if (arr.length == 41) {
      alert("최대 40회 추가 가능 합니다");
      return;
    }
    arr[arr.length - 1].key = arr.length;
    setlist(arr);
  };
  const listset = () => {
    let value = video.duration / selectBox;
    let arr = [];
    for (let i = 1; i <= selectBox; i++) {
      if (value * i >= 60) {
        let minute = Math.floor((value * i) / 60 / 1);
        let second = Math.ceil(((value * i) % 60) / 1);
        arr.push({ key: i, min: minute, sec: second });
      } else {
        arr.push({ key: i, min: 0, sec: value * i });
      }
    }
    setlist(arr);
  };
  useEffect(listset, [selectBox]);

  return (
    <>
      <div className="item_add item_add_category" style={mainBOX}>
        <div style={maintopBOX}>
          <div style={mainseleText} onClick={listset}>
            선택된 동영상 (원본)
          </div>
          <VideoBox video={video} />
        </div>

        <div style={mainbottomBOX}>
          <div style={mainblackLine}></div>

          <div style={{ display: "flex", position: "relative" }}>
            <ChoiceBOX
              Number={number}
              AddList={addList}
              list={list}
              video={video.duration}
            />
            <TableTC choice={selectBox} list={list} video={video.duration} />
          </div>

          <div
            style={{ position: "absolute", marginTop: "1.5rem", right: "40px" }}
          >
            <button onClick={handleSubmit} style={submitButton}>
              확인
            </button>
          </div>
        </div>
      </div>

      {submitModal && (
        <AiSubmit
          video={video.idx} // boshow_player 사용으로 비디오 URL이 아닌 idx가 필요
          handleSubmit={handleSubmit}
          type="ai_TC"
          tcTimeList={list}
          item={item}
        />
      )}
    </>
  );
};

export default ModelFix;
