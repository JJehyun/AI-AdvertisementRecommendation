import React, { useState, useRef, useEffect } from "react";
import { withRouter } from "react-router-dom";

import axios from "axios";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { settingDuration } from "../../components/common";
import { getCookie, setCookie } from "../user/cookies";

const AiModeling = (props) => {
  const { video, item, setItem, prevLevel, setItemDetail } = props;
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState({
    title: null,
    process: null,
    draw_img_name: null,
  });
  const interval = useRef();
  const elapsedInterval = useRef();
  const [deleteItem, setDeleteItem] = useState([]);
  let [elapsedTime, setElapsedTime] = useState(0);
  const boshow_token = getCookie("boshow_token");

  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
  const make_image_path = image_path + "make_image/";
  const item_image_path = image_path + "item_image/";
  const video_path = image_path + "videos/";

  useEffect(() => {
    let video_url = "";
    checkToken();
    switch (video.platform) {
      case "YOUTUBE":
        video_url = "https://www.youtube.com/embed/" + video.url.substr(32, 11);
        break;
      case "SBS":
        let url = video.url.split("?")[0];
        let SBS_video_id = url.split("/");
        SBS_video_id = SBS_video_id[SBS_video_id.length - 1];

        axios
          .get("/MakeSbsToken", null, {
            headers: { "content-type": "application/json" },
          })
          .then((response) => {
            const token = response.data.token;

            axios
              .get(
                "http://apis.sbs.co.kr/play-api/ad-admin/1.0/boshow/media/" +
                  SBS_video_id +
                  "?pnw-token=" +
                  token,
                {
                  headers: { "content-type": "application/json" },
                }
              )
              .then((response) => {
                video_url = response.data.mediaurl;
              });
          });
        break;
      case "직접 업로드":
        video_url = video_path + video.idx + "." + video.url;
        break;
    }

    setVideoUrl(video_url);

    window.history.pushState({}, "", "/ai_make");
    window.onpopstate = (e) => {
      prevLevel();
    };

    return () => {
      localStorage.removeItem("modeling");
      clearInterval(elapsedInterval.current);
      progressInterval(false);
      axios.put("/ProgressProcess", null, { params: { video_idx: video.idx } });
    };
  }, []);

  const checkToken = () => {
    const token = getCookie("boshow_token");
    const decodeToken = jwt_decode(token);
    const expConvertDate = new Date(decodeToken.exp * 1000);
    const currentTime = new Date();
    const calc = (expConvertDate.getTime() - currentTime.getTime()) / 1000 / 60;

    if (token) {
      const formData = new FormData();
      formData.append("token", token);

      if (calc <= 5 && calc > -1) {
        axios
          .post("/Auth", formData)
          .then((response) => {
            setCookie("boshow_token", response.data);

            if (response.data.status === 500) {
              alert(
                "토큰 재발행을 실패했습니다. 업로드 작업을 수행하시려면 재로그인을 해주세요"
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  // progress 부분
  // Detection 중일 경우 "상품 찾는중.."
  // Classification 중일 경우 "상품 연결중.."
  const progressInterval = (status) => {
    if (status) {
      let title = "";

      interval.current = setInterval(() => {
        checkToken();
        axios
          .get("/ProgressProcess", { params: { fk_video_idx: video.idx } })
          .then((response) => {
            const data = response.data[0];

            if (data.ai_status == 1) {
              title = "상품 찾는중..";
            } else {
              if (data.progress === 100) {
                title = "모델링 완료";
              } else {
                title = "상품 연결중..";
              }
            }

            setProgress({
              title: title,
              process: data.progress,
              draw_img_name: data.draw_img_name,
            });
          });
      }, 500);
    } else {
      clearInterval(interval.current);
    }
  };

  const elapsedTimeInterval = (status) => {
    if (status) {
      elapsedInterval.current = setInterval(() => {
        setElapsedTime((elapsedTime += 1));
      }, 1000);
    } else {
      clearInterval(elapsedInterval.current);
    }
  };

  const ItemSearching = () => {
    localStorage.setItem("modeling", video.idx);
    const modeling_btn = document.getElementById("modeling_btn");
    modeling_btn.className = "hide";

    let item_idx = [];

    for (const i in item) {
      item_idx.push(item[i].idx);
    }

    const params = {
      video_idx: video.idx,
      item_idx: item_idx,
      user_token: boshow_token,
    };

    elapsedTimeInterval(true);
    progressInterval(true);

    axios
      .post("/ItemDetail", null, { params: params })
      .then(async (response) => {
        localStorage.removeItem("modeling");
        if (!response.data) {
          elapsedTimeInterval(false);
          return progressInterval(false);
        }
        setItemDetail(response.data);

        await elapsedTimeInterval(false);
        await progressInterval(false);
        let draw_name = response.data[response.data.length - 1].position;
        setProgress({
          ...progress,
          title: "모델링 완료",
          process: 100,
          draw_img_name: String(draw_name).padStart(5, "0"),
        });
      });
  };

  // 아이템 선택 (선택 후 선택 삭제)
  const handleDelete = (e) => {
    let idx = parseInt(e.target.value);
    let delete_item = [...deleteItem];

    if (delete_item.indexOf(idx) === -1) {
      delete_item.push(idx);
    } else {
      let index = delete_item.indexOf(idx);
      delete_item.splice(index, 1);
    }

    setDeleteItem(delete_item);
  };

  // 전체 삭제
  const itemDeleteAll = async () => {
    let idx_list = [];

    item.filter((data, key) => {
      idx_list.push(data.idx);
    });

    await setDeleteItem(idx_list);
    itemDelete();
  };

  // 선택 삭제
  const itemDelete = () => {
    if (progress.process !== null && progress.process < 100) {
      return alert("모델링 중에는 삭제할 수 잆습니다.");
    } else if (progress.process === 100) {
      if (deleteItem.length > 0) {
        axios.put("/ItemDetail", null, {
          params: { delete_item_idx: deleteItem },
        });
      }
    }

    let _item = [...item];
    let key_list = [];

    item.filter((data, key) => {
      if (deleteItem.indexOf(data.idx) !== -1) {
        key_list.push(key);
      }
    });

    key_list.sort((a, b) => {
      return b - a;
    });

    for (let i in key_list) {
      _item.splice(key_list[i], 1);
    }

    setItem(_item);
    setDeleteItem([]);
  };

  return (
    <div className="make_ai_modeling">
      <div className="make_ai_modeling_video">
        <span className="make_ai_model_edit_link_video">
          <h1>선택된 동영상</h1>
          {video.platform === "YOUTUBE" && (
            <iframe src={videoUrl} width="450" height="253" controls />
          )}
          {(video.platform === "SBS" || video.platform === "직접 업로드") && (
            <video src={videoUrl} width="450" height="253" controls />
          )}
        </span>

        <span>
          <h1>모델링 화면</h1>
          {progress.title && (
            <span className="make_ai_modeling_spinner">
              {progress.title}
              <br />
              {progress.process < 100 && progress.process + "%"}
            </span>
          )}
          {progress.title == null ? (
            <p>모델링을 시작해주세요</p>
          ) : (
            progress.draw_img_name && (
              <img
                className="make_ai_model_draw_img"
                height="253px"
                src={
                  make_image_path +
                  String(video.idx) +
                  "/draw_images/" +
                  progress.draw_img_name +
                  ".jpg"
                }
              />
            )
          )}
          <div style={{ color: "#b4b4b4", fontSize: "12px" }}>
            {elapsedTime > 0 &&
              `모델링 경과시간 : ${settingDuration(elapsedTime)}`}
          </div>
        </span>

        <div id="modeling_btn" className="make_ai_modeling_video_start">
          <p>AI모델링 시작 버튼을 누르면 상품연결을 시작합니다.</p>
          <button type="button" onClick={ItemSearching}>
            AI모델링 시작
          </button>
        </div>
      </div>
      <div className="make_ai_modeling_item">
        <p>
          연결된 상품
          <button onClick={itemDelete}>선택삭제</button>
          <button onClick={itemDeleteAll}>전체삭제</button>
        </p>
        <div>
          {progress.process > 0 &&
            item.map((value, key) => (
              <div key={key}>
                <input
                  type="checkbox"
                  id={"list" + value.idx}
                  value={value.idx}
                  onClick={handleDelete}
                  checked={deleteItem.indexOf(value.idx) !== -1}
                />
                <label for={"list" + value.idx}>
                  <img
                    className="make_ai_model_draw_img"
                    src={item_image_path + value.idx + "/item_1.jpg"}
                  />
                </label>
              </div>
            ))}
        </div>
        {progress.process === 100 && props.children}
      </div>
    </div>
  );
};

const mapStateToProps = function (state) {
  return {
    userId: state.authentication.login.userId,
  };
};

export default connect(mapStateToProps)(withRouter(AiModeling));
