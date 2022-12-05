import React, { useState, useEffect } from "react";

import no_img from "../images/common/no_item.png";

const AdbTypeB = (props) => {
  const { selected_adb } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onSetSidebarOpen = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div
        className={
          sidebarOpen ? "B_type_advertise sidebarOpen" : "B_type_advertise"
        }
      >
        <span onClick={onSetSidebarOpen}>
          <span className="B_type_side_mini"></span>
        </span>
        <div>
          <img src={no_img} />
          <div className="B_type_hash_tag">
            <button type="button">#태그</button>
            <button type="button">#태그</button>
          </div>
          <ul className="B_type_info">
            <li>{selected_adb.name ? selected_adb.name : "상품명"}</li>
            <li>{selected_adb.price ? selected_adb.price : "판매가"}</li>
            <li>
              {selected_adb.description ? selected_adb.description : "상품특징"}
            </li>
          </ul>
          <ul className="B_type_btn">
            <li>
              <button type="button">
                <a href={selected_adb.url}>바로 구매하기</a>
              </button>
            </li>
            <li>
              <button type="button">
                <a href={selected_adb.url}>자세히 보기</a>
              </button>
              <button type="button">♡</button>
            </li>
          </ul>
          <div className="B_type_add">
            {selected_adb.idx ? (
              <img
                src={
                  `${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/` +
                  selected_adb.idx +
                  ".jpg"
                }
              />
            ) : (
              "B타입"
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdbTypeB;
