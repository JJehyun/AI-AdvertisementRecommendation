import React, { useState, useEffect } from "react";
import {
  tableback,
  tablebackborder,
  tablecoulumn,
  tableNumber,
  tableMinbox,
  tableComMA,
  tableSecbox,
  tableTexts,
} from "./styles";
const TableTC = (props) => {
  useEffect(() => {
    setTimeTable(props.list);
  });
  const [timeTable, setTimeTable] = useState([]);

  //분 text 변경
  const ChangeMin = (e) => {
    let arr = [...timeTable];
    let regex = /[^0-9]/g;
    let min = Math.floor(props.video / 60);
    if (e.target.value > min) {
      return;
    }
    var result = e.target.value.replace(regex, "");
    arr[e.target.name - 1].min = result;
    setTimeTable(arr);
  };
  //초 text 변경
  const ChangeSec = (e) => {
    let arr = [...timeTable];
    let regex = /[^0-9]/g;
    let min = arr[e.target.name - 1].min * 60;
    let sec = e.target.value;
    let total = parseInt(min) + parseInt(sec);
    if (parseInt(sec) > 60) {
      return;
    }
    if (total > props.video) {
      return;
    }
    var result = e.target.value.replace(regex, "");
    arr[e.target.name - 1].sec = result;
    setTimeTable(arr);
  };
  //시작 했을 때 행의 갯수를 계산하는 함수
  const countlist = (key) => {
    let timeList = [];
    for (let i = 1; i <= key; i++) {
      if (1 == i % 5) {
        timeList.push("번호TC");
      }
      timeList.push(i);
    }
    let renderTimeList = [];
    for (let i = 0; i < timeList.length; i += 6)
      renderTimeList.push(timeList.slice(i, i + 6));
    return (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {props.choice == 0 && timeTable.length == 0 ? (
            <div style={tableTexts}>횟수를 입력해주세요</div>
          ) : null}
          {renderTimeList.map((value, keys) => (
            <>
              <div style={{ display: "flex" }}>
                <div style={keys == 0 ? {borderLeft:"none"} : {borderLeft:"1px solid #707070"}}>
                  {renderTimeList[keys].map((value, key) => (
                    <>
                      <div>
                        {value == "번호TC" ? (
                          <div style={tablecoulumn}>{value}</div>
                        ) : (
                          <></>
                        )}
                        {"번호TC" != value ? (
                          <>
                            <div style={{ display: "flex" }}>
                              <div style={tableNumber}>{value}</div>
                              <input
                                name={value}
                                style={tableMinbox}
                                value={Math.round(timeTable[value - 1]?.min)}
                                onChange={ChangeMin}
                              />
                              <div style={tableComMA}>'</div>
                              <input
                                name={value}
                                value={Math.ceil(timeTable[value - 1]?.sec)}
                                style={tableSecbox}
                                onChange={ChangeSec}
                              />
                              <div style={tableComMA}>"</div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </>
          ))}
        </div>
      </>
    );
  };
  return (
    <>
      <div style={tableback}>
        <div style={tablebackborder}>
          <div style={{ display: "flex" }}>{countlist(timeTable.length)}</div>
        </div>
      </div>
    </>
  );
};
export default TableTC;
