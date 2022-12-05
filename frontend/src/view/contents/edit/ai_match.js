import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";
import bagImage from "../../images/categoryImage/가방.svg";
import hatImage from "../../images/categoryImage/모자.svg";
import topImage from "../../images/categoryImage/상의.svg";
import shoesImage from "../../images/categoryImage/신발.svg";
import culotImage from "../../images/categoryImage/치마.svg";
import bottomImage from "../../images/categoryImage/하의.svg";

import ic_video_achive_search from "../../images/common/icons/ic_video_achive_search.png";
import video_add_foler from "../../images/common/video_add_folder.png";

import item_insert_level2 from "../../images/common/item_insert_level2.png";
import ic_item_category_select from "../../images/common/ic_item_category_select.png";
import { getCookie, setCookie } from "../user/cookies";

const AiMatchCategory = (props) => {
  const {
    add_data,
    data,
    video,
    category,
    prevLevel,
    nextLevel,
    setMatch,
    setItemDetail,
  } = props;
  const [posts, setPosts] = useState([]);
  const [categoryRender, setCategoryRender] = useState([]);
  const [checklevel, setchecklevel] = useState(false);
  // const [changePost, setChangePost] = useState([]);
  const boshow_token = getCookie("boshow_token");
  const [selected_category, setSelectedCategory] = useState({
    level_0: 0,
    level_1: 0,
    level_2: 0,
    level_3: 0,
    now_select_idx: 0,
    now_select_level: 0,
  });
  const [selected_categories, setSelectedCategories] = useState([]);
  let [inputAct, inputActSet] = useState(true);
  let [ListOn, ListOnSet] = useState(false);
  let [ListThree, ListThreeSet] = useState(false);
  const [isMatching, setIsMatching] = useState(true);
  let [selectArray, selectArraySet] = useState([]);

  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState({
    title: null,
    process: null,
    draw_img_name: null,
  });
  const interval = useRef();

  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
  const make_image_path = image_path + "make_image/";
  const item_image_path = image_path + "item_image/";
  const video_path = image_path + "videos/";

  const categoryNames = [
    { categroyImg: topImage, categoryName: "상의" },
    { categroyImg: bottomImage, categoryName: "하의" },
    { categroyImg: culotImage, categoryName: "치마" },
    { categroyImg: shoesImage, categoryName: "신발" },
    { categroyImg: hatImage, categoryName: "모자" },
    { categroyImg: "", categoryName: "골프공" },
    { categroyImg: bagImage, categoryName: "골프가방" },
    { categroyImg: "", categoryName: "골프클럽" },
    { categroyImg: "", categoryName: "마스크" },
    { categroyImg: "", categoryName: "드레스" },
    { categroyImg: "", categoryName: "코트" },
    { categroyImg: "", categoryName: "시계" },
  ];

  useEffect(() => {
    filterCategory();
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
      default:
        break;
    }

    setVideoUrl(video_url);

    window.history.pushState({}, "", "/ai_faiss");
    window.onpopstate = (e) => {
      prevLevel();
    };

    return () => {
      localStorage.removeItem("modeling");
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

  const progressInterval = (status) => {
    if (status) {
      interval.current = setInterval(() => {
        checkToken();
        axios
          .get("/ProgressProcess", { params: { fk_video_idx: video.idx } })
          .then((response) => {
            const data = response.data[0];

            setProgress({
              title:
                data.ai_status === 1
                  ? "모델링 중..."
                  : categoryNames[data.draw_img_name].categoryName,
              process: data.progress,
              draw_img_name: data.draw_img_name,
            });
          });
      }, 500);
    } else {
      clearInterval(interval.current);
    }
  };

  // AI 매치
  const AiMatching = () => {
    setIsMatching(false);
    let cateNum = [];
    category.forEach((isCategory, idx) => {
      if (isCategory) {
        cateNum.push(idx);
      }
    });

    const params = {
      video_idx: video.idx,
      cateNum: cateNum,
      user_token: boshow_token,
    };

    // elapsedTimeInterval(true);
    progressInterval(true);

    axios.post("/FaissApi", null, { params: params }).then(async (response) => {
      await progressInterval(false);
      await setMatch(response.data);
      add_data({ ...data, fk_category_idx: selectArray });
      nextLevel();
    });
  };

  const handleOnClick = (e, idx, level) => {
    e.preventDefault();
    if (idx == selected_category.now_select_idx && level == 0) {
      ListOnSet(true);
      setSelectedCategory({
        ...selected_category,
        ["level_" + level]: 0,
        now_select_idx: 0,
        now_select_level: level - 1,
      });
      return false;
    }
    switch (level) {
      case 0:
        setSelectedCategory({
          level_0: idx,
          level_1: 0,
          level_2: 0,
          level_3: 0,
          now_select_idx: idx,
          now_select_level: level,
        });
        break;
      case 1:
        ListThreeSet(true);
        setSelectedCategory({
          level_0: selected_category.level_0,
          level_1: idx,
          level_2: 0,
          level_3: 0,
          now_select_idx: idx,
          now_select_level: level,
        });
        break;
      case 2:
        ListOnSet(true);
        setSelectedCategory({
          level_0: selected_category.level_0,
          level_1: selected_category.level_1,
          level_2: idx,
          level_3: 0,
          now_select_idx: idx,
          now_select_level: level,
        });
        break;
      case 3:
        console.log(selectArray);
        ListOnSet(true);
        setSelectedCategory({
          level_0: selected_category.level_0,
          level_1: selected_category.level_1,
          level_2: selected_category.level_2,
          level_3: idx,
          now_select_idx: idx,
          now_select_level: level,
        });

      default:
        break;
    }
  };

  const get_category = async () => {
    await axios
      .get("/ItemCategoryApi", { params: { boshow_token: boshow_token } })
      .then((response) => {
        setPosts(response.data);
      });
  };

  const filterCategory = () => {
    const categoryName = [
      { categroyImg: topImage, categoryName: "상의" },
      { categroyImg: bottomImage, categoryName: "하의" },
      { categroyImg: culotImage, categoryName: "치마" },
      { categroyImg: shoesImage, categoryName: "신발" },
      { categroyImg: hatImage, categoryName: "모자" },
      { categroyImg: "", categoryName: "골프공" },
      { categroyImg: bagImage, categoryName: "골프가방" },
      { categroyImg: "", categoryName: "골프클럽" },
      { categroyImg: "", categoryName: "마스크" },
      { categroyImg: "", categoryName: "드레스" },
      { categroyImg: "", categoryName: "코트" },
      { categroyImg: "", categoryName: "시계" },
    ];

    const categoryArray = []; //선택된 카테고리 배열
    for (let i = 0; i <= category.length; i++) {
      if (category[i]) {
        categoryArray.push(categoryName[i]);
      }
    }
    setCategoryRender(categoryArray);
  };

  const category_delete = async () => {
    let is_category = posts.filter((data) => {
      return data.idx === selected_category.now_select_idx;
    });
    if (is_category.length === 0) {
      return alert("삭제할 카테고리를 선택해주세요.");
    }
    if (selected_categories.length > 0) {
      if (
        is_category[0].idx ==
        selected_categories[0]["level_" + String(is_category[0].level)]
      ) {
        await setSelectedCategories([]);
      }
    }
    await axios
      .delete("/ItemCategoryApi", {
        params: {
          boshow_token: boshow_token,
          idx: selected_category.now_select_idx,
        },
      })
      .then((response) => {
        if (response.status == 200) {
          alert("삭제되었습니다.");
          setSelectedCategory({ ...selected_category, now_select_idx: 0 });
          get_category();
        } else {
          alert("실패");
        }
      });
  };

  const next_submit = () => {
    if (checklevel == false) return;
    add_data({ ...data, fk_category_idx: selectArray });
    nextLevel();
  };

  const category_list_level_4 = (idx) => {
    return posts.map((menu, key) => (
      <>
        {menu.level == 3 && menu.parent == idx && (
          <ul key={key}>
            <li>{category(menu)}</li>
          </ul>
        )}
      </>
    ));
  };

  const category_list_level_3 = (idx) => {
    if (ListOn) {
      return posts.map((menu, key) => (
        <>
          {menu.level == 2 && menu.parent == idx && (
            <ul key={key}>
              <li>
                {category(menu)}
                {category_list_level_4(menu.idx)}
              </li>
            </ul>
          )}
        </>
      ));
    } else {
      return posts.map((menu, key) => (
        <>
          {menu.level == 2 && menu.parent == idx && (
            <ul key={key}>
              <li>
                {category(menu)}
                {selected_category.level_2 == menu.idx &&
                  selected_category.now_select_level >= menu.level &&
                  category_list_level_4(menu.idx)}
              </li>
            </ul>
          )}
        </>
      ));
    }
  };
  const category_list_level_2 = (idx) => {
    if (ListThree == true) {
      return posts.map((menu, key) => (
        <>
          {menu.level == 1 && menu.parent == idx && (
            <ul key={key}>
              <li>
                {category(menu)}
                {category_list_level_3(menu.idx)}
              </li>
            </ul>
          )}
        </>
      ));
    } else {
      return posts.map((menu, key) => (
        <>
          {menu.level == 1 && menu.parent == idx && (
            <ul key={key}>
              <li>
                {category(menu)}
                {selected_category.level_1 == menu.idx &&
                  selected_category.now_select_level >= menu.level &&
                  category_list_level_3(menu.idx)}
              </li>
            </ul>
          )}
        </>
      ));
    }
  };

  const category_list = posts.map((menu, key) => (
    <>
      {menu.level == 0 && (
        <li key={key}>
          {category(menu)}
          {selected_category.level_0 == menu.idx &&
            selected_category.now_select_level >= menu.level &&
            category_list_level_2(menu.idx)}
        </li>
      )}
    </>
  ));

  return (
    <>
      <div
        className="item_add item_add_category"
        style={{ alignItems: "flex-start" }}
      >
        <div className="item_add_left">
          <h1 className="title">선택된 카테고리</h1>
          <p
            className="category_name_change"
            style={{
              color: "#a5a5a5",
              lineHeight: "2",
              verticalAlign: "top",
            }}
          >
            AI 매치 (디텍션)에 사용할 카테고리를 확인해보세요.
          </p>
          <div className="category_hierarchy">
            <div>
              <div id="demo">
                <ul class="tree-menu">
                  {category_list}
                  {categoryRender.map((category) => (
                    <li style={{ display: "flex" }}>
                      <img
                        style={{
                          width: "20px",
                          height: "20px",
                          position: "relative",
                          marginTop: "4px",
                          right: "4px",
                        }}
                        className="videocategorylistimg"
                        src={video_add_foler}
                      />
                      <p>
                        <img
                          src={category.categroyImg}
                          alt=""
                          style={{
                            position: "relative",
                            top: "5px",
                            margin: "0 5px",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            letterSpacing: " -0.17px",
                            textAlign: "left",
                            color: "#000000",
                          }}
                        >
                          {category.categoryName}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="item_add_right" style={{ width: "58%" }}>
          <h1 className="title">AI 매치할 동영상</h1>
          <p
            className="category_name_change"
            style={{
              color: "#a5a5a5",
              lineHeight: "2",
              verticalAlign: "top",
              marginBottom: "20px",
            }}
          >
            선택된 카테고리와 동영상을 매치시켜 상품을 매치 시켜보세요.
          </p>
          <span>
            {/*비디오 삽입*/}
            {progress.title && (
              <span
                className="make_ai_modeling_spinner"
                style={{
                  position: "absolute",
                  top: "calc(50% - 90px)",
                  left: "calc(50% + 195px)",
                  width: "66px",
                  padding: "11px 0",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  fontSize: "11px",
                  lineHeight: "1.25",
                  letterSpacing: "-0.14px",
                  textAlign: "center",
                  color: "#ffffff",
                }}
              >
                {progress.process !== null && progress.title}
                <br />
                {progress.process !== null && progress.process + "%"}
              </span>
            )}
            {video.platform === "YOUTUBE" ? (
              <iframe
                src={videoUrl}
                width="701"
                height="393"
                controls
                style={{ borderRadius: "5px" }}
              ></iframe>
            ) : (
              (video.platform === "SBS" ||
                video.platform === "직접 업로드") && (
                <iframe
                  src={videoUrl}
                  width="701"
                  height="393"
                  controls
                  style={{ borderRadius: "5px" }}
                ></iframe>
              )
            )}
          </span>
          <button
            type="button"
            onClick={AiMatching}
            style={
              isMatching
                ? {
                    display: "block",
                    margin: "17px 3px 0px 595px",
                    objectFit: "contain",
                    width: "103px",
                    height: "28px",
                    border: "1px solid #4d20a3",
                    borderRadius: "10px",
                    backgroundColor: "white",
                    color: "#4d20a3",
                  }
                : {
                    visibility: "hidden",
                    margin: "17px 3px 0px 595px",
                    width: "103px",
                    height: "28px",
                  }
            }
          >
            AI 매치
          </button>
        </div>
        <button type="button" onClick={next_submit}>
          다음
        </button>
      </div>
    </>
  );
};

export default withRouter(AiMatchCategory);
