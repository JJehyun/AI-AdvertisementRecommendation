import axios from "axios";
import React, { useState, useEffect } from "react";
import no_img from "../images/common/no_item.png";

const Commerce = (props) => {
  const { selected_adb } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  };

  const unComma = (str) => {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
  };

  return (
    <>
      <div
        className={
          sidebarOpen ? "C_type_advertise sidebarOpen" : "C_type_advertise"
        }
      >
        <span onClick={() => setSidebarOpen(!sidebarOpen)}>
          <span className="C_type_side_mini"></span>
        </span>

        <div>
          <span>커머스</span>
          {/* <div
            style={{
              position: "relative",
              left: "118px",
              right: "0",
              width: "20px",
              position: "relative",
              borderRadius: "10%",
              marginBottom: "0.5rem",
              fontSize: "8px",
              color: "#bababa",
              border: "1px solid #bababa",
            }}
          >
            AD
          </div> */}
          {selected_adb && selected_adb.idx ? (
            <img
              src={`${
                process.env.REACT_APP_BACKEND_HOST
              }static/item_image/${parseInt(
                selected_adb && selected_adb.idx
              )}/item_1.jpg`}
            />
          ) : (
            <img src={no_img} />
          )}
          <div className="C_type_hash_tag">
            {selected_adb.tag &&
              selected_adb.tag.map((data, i) => (
                <button key={i} type="button">
                  #{data.tag}
                </button>
              ))}
          </div>
          <ul className="C_type_info">
            <li>{selected_adb && selected_adb.title}</li>
            <li>{comma(unComma(selected_adb && selected_adb.price))}원</li>
            <li>{selected_adb && selected_adb.description}</li>
          </ul>
          <ul className="C_type_btn">
            <li>
              <button type="button">
                <a href={selected_adb && selected_adb.url} target="_blank">
                  바로 구매하기
                </a>
              </button>
            </li>
            <li>
              <button type="button">
                <a href={selected_adb && selected_adb.url} target="_blank">
                  자세히 보기
                </a>
              </button>
              <button type="button">♡</button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Commerce;
