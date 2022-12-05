import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";
import VideoContainer from "../../components/video_container.js";
import ItemContainer from "../../components/item_container.js";
import ModelFix from "./ai_model_TC/ModelFix"
const AiTcFix = (props) => {
  const [level, setLevel] = useState(1);
  const [step, setStep] = useState(null);
  const [video, setVideo] = useState({});
  const [item, setItem] = useState([]);

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
          <ModelFix video={video} item={item}/>
        );
        break;
      default:
        setStep(<AiTcFix />);
        break;
    }
  };

  return (
    <>
      <Header mode="editing"></Header>
      <ManageNav mode="editing" menu="AI" sub_menu="AI TC fix"></ManageNav>
      <section className="content make_ai">
        <h1 className="title">
          AI TC fix
          <span>등록한 동영상과 상품을 연결하여 TC를 직접 입력해보세요!</span>
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
            className={level === 3 ? "tc_selected" : "tc_non_selected"}
          >
            모델링 &amp; TC 편집
          </li>
        </ul>
        {step}
      </section>
    </>
  );
};

export default withRouter(AiTcFix);
