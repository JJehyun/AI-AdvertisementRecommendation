import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";
import VideoContainer from "../../components/video_container.js";
import ItemContainer from "../../components/item_container.js";
import AiModeling from "./ai_modeling.js";
import AiEdit from "./ai_edit.js";

import axios from "axios";

const AiMake = (props) => {
  const [level, setLevel] = useState(1);
  const [step, setStep] = useState(null);
  const [video, setVideo] = useState({});
  const [item, setItem] = useState([]);
  const [itemDetail, setItemDetail] = useState([]);
  const modeling = localStorage.getItem("modeling");

  useEffect(() => {
    if (modeling !== null) {
      axios.put("/ProgressProcess", null, { params: { video_idx: modeling } });
      localStorage.removeItem("modeling");
    }
  }, []);

  const prevLevel = () => {
    setLevel(level - 1);
  };

  const nextLevel = () => {
    setLevel(level + 1);
  };

  const changeLevel = (level) => {
    if (Object.keys(video).length === 0) {
      setLevel(1);
    } else if (level !== 1 && item.length === 0) {
      setLevel(2);
    } else {
      setLevel(level);
    }
  };

  useEffect(() => {
    if (Object.keys(video).length) {
      const video_btn = document.getElementById("video_btn");

      try {
        video_btn.className = "";
      } catch {}
    }

    levelStep();
  }, [video]);

  useEffect(() => {
    if (item.length) {
      const item_btn = document.getElementById("item_btn");

      try {
        item_btn.className = "";
      } catch {}
    }

    levelStep();
  }, [item]);

  useEffect(() => {
    levelStep();
  }, [level]);

  const levelStep = () => {
    switch (level) {
      case 1:
        setStep(
          <VideoContainer type="ai" setVideo={setVideo}>
            <button
              id="video_btn"
              className="hide"
              type="button"
              onClick={nextLevel}
            >
              다음
            </button>
          </VideoContainer>
        );
        break;
      case 2:
        setStep(
          <ItemContainer type="ai" prevLevel={prevLevel} setItem={setItem}>
            <button
              id="item_btn"
              className="hide"
              type="button"
              onClick={nextLevel}
            >
              다음
            </button>
          </ItemContainer>
        );
        break;
      case 3:
        setStep(
          <AiModeling
            video={video}
            item={item}
            setItem={setItem}
            prevLevel={prevLevel}
            setItemDetail={setItemDetail}
          >
            <button type="button" onClick={nextLevel}>
              다음
            </button>
          </AiModeling>
        );
        break;
      default:
        setStep(<AiEdit video={video} item={item} itemDetail={itemDetail} />);
        break;
    }
  };

  return (
    <>
      <Header mode="editing" />
      <ManageNav mode="editing" menu="AI" sub_menu="AI Matching" />
      <section className="content make_ai">
        <h1 className="title">
          AI Matching
          <span>등록한 동영상과 상품을 선택하여 AI를 만들어보세요!</span>          
        </h1>
        <ul className="make_ai_level">
          <li
            onClick={() => changeLevel(1)}
            className={level === 1 ? "selected" : ""}
          >
            동영상 선택
          </li>
          <li
            onClick={() => changeLevel(2)}
            className={level === 2 ? "selected" : ""}
          >
            상품 선택
          </li>
          <li
            onClick={() => changeLevel(3)}
            className={level === 3 ? "selected" : ""}
          >
            AI 모델링
          </li>
          <li className={level === 4 ? "selected" : ""}>AI 편집</li>
        </ul>
        {step}
      </section>
    </>
  );
};

export default withRouter(AiMake);
