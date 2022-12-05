import React, { useState, useEffect } from "react";
import TCfixadd from "../../../images/common/TCfixadd.png";
import _ from 'lodash';

import {
  choiceBigbox,
  autoText,
  selectBOX,
  TCaddText,
  TCNumberinput,
  TCNumbertwoinput,
  TCBottomflexbox,
  TCaddBtnimg,
} from "./styles";

const ChoiceBOX = (props) => {
  let [minute, minSet] = useState(0);
  let [second, seoSet] = useState();

  const SearchTime = () => {
    let arr = [...props.list];
    let array = [];
    for (let i = 0; i < arr.length; i++) {
      array.push(Math.ceil(arr[i].min * 60 + arr[i].sec));
    }
    return array;
  };

  const min = (e) => {
    let min = Math.floor(props.video / 60);
    let regex = /[^0-9]/g;
    var results = e.target.value.replace(regex, "");
    if (results > min) {
      return;
    }
    minSet(results);
  };

  const sec = (e) => {
    let regex = /[^0-9]/g;
    var result1 = e.target.value.replace(regex, "");
    let totals = parseInt(minute * 60) + parseInt(result1);
    if (result1 >= 60) {
      return;
    }
    if (totals > props.video) {
      return;
    }
    seoSet(result1);
  };

  const submit = () => {
    let totalTimes = parseInt(minute * 60) + parseInt(second);
    if (SearchTime().includes(totalTimes)) {
      alert("중복된 시간이 있습니다.");
      return;
    }
    if (second) {
      if (minute) {
        props.AddList({
          key: "0",
          min: parseInt(minute),
          sec: parseInt(second),
        });
      } else {
        props.AddList({ key: "0", min: 0, sec: parseInt(second) });
      }
    }
  };
  return (
    <>
      <div style={choiceBigbox}>
        <div style={autoText}>자동 TC(최대 30회)</div>
        <select
          style={selectBOX}
          onChange={(e) => {
            props.Number(e.target.value);
          }}
        >
          <option value="0" disabled selected>
            횟수 선택
          </option>
          {_.range(1, 30 + 1).map(value => <option key={value} value={value}>{value}</option>)}
        </select>
        <div style={TCaddText}>TC 추가 (최대 10회)</div>
        <div style={{ display: "flex" }}>
          <input
            className="twoInput"
            style={TCNumberinput}
            onChange={min}
            value={minute}
          />
          <input
            className="oneInput"
            style={TCNumbertwoinput}
            onChange={sec}
            value={second}
          />

          <span className="oneInput" style={{ marginTop: "17px" }}></span>
          <span className="twoInput" style={{ marginTop: "17px" }}></span>
        </div>
        <div style={TCBottomflexbox}>
          <button style={TCaddBtnimg} onClick={submit}>
            + TC추가
          </button>
        </div>
      </div>
    </>
  );
};

export default ChoiceBOX;
