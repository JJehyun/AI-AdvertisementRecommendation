import React, { useState } from "react";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";

import VideoContainer from "../../components/video_container.js";
import OpAdvertisingListLevel2 from "./oper_advertising_level2.js";

import useSWR from "swr";
import { fetchWithToken } from "../../../fetcher.js";
import { getCookie } from "../user/cookies.js";

const OpAdvertisingList = (props) => {
  const [level, setLevel] = useState(1);
  const [video, setVideo] = useState({});

  const { data: userInfo, error } = useSWR(
    ["/FindUserDetails", getCookie("boshow_token")],
    fetchWithToken
  );

  console.log(userInfo);

  const nextLevel = () => {
    if (Object.keys(video).length) setLevel(level + 1);
    else alert("동영상을 선택해주세요.");
  };

  const changeLevel = (level) => {
    console.log(level);
    if (level > 1 && Object.keys(video).length === 0) {
      return;
    }
    setLevel(level);
  };

  return (
    <>
      <Header mode="operation"></Header>
      <ManageNav mode="operation" menu="광고" sub="광고"></ManageNav>
      <section className="content make_ai">
        <h1 className="title">광고</h1>
        <ul className="op_adb_level">
          <li
            onClick={() => changeLevel(1)}
            className={level == 1 && "selected"}
          >
            동영상 선택
          </li>
          <li
            onClick={() => changeLevel(2)}
            className={level == 2 && "selected"}
          >
            광고 타입 선택
          </li>
        </ul>
        {level == 1 && (
          <VideoContainer type="ai" setVideo={setVideo}>
            {userInfo && userInfo.tier >= 2 && (
              <button type="button" onClick={nextLevel}>
                다음
              </button>
            )}
          </VideoContainer>
        )}
        {level == 2 && (
          <OpAdvertisingListLevel2 videoList={video}></OpAdvertisingListLevel2>
        )}
      </section>
    </>
  );
};

export default OpAdvertisingList;
