import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import ic_video_achive_search from "../../images/common/icons/ic_video_achive_search.png";
import ic_item_category_select from "../../images/common/ic_item_category_select.png";
import video_add_folder from "../../images/common/video_add_folder.png";
import video_add_categoryJ from "../../images/common/video_add_categoryJ.png";
import bagImage from "../../images/categoryImage/가방.svg";
import hatImage from "../../images/categoryImage/모자.svg";
import topImage from "../../images/categoryImage/상의.svg";
import shoesImage from "../../images/categoryImage/신발.svg";
import culotImage from "../../images/categoryImage/치마.svg";
import bottomImage from "../../images/categoryImage/하의.svg";

const VideoAddCategory = (props) => {
  const [categoryselect0, Setcategoryselect0] = useState(false);
  const [categoryselect1, Setcategoryselect1] = useState(false);
  const [categoryselect2, Setcategoryselect2] = useState(false);
  const [categoryselect3, Setcategoryselect3] = useState(false);
  const [categoryselect4, Setcategoryselect4] = useState(false);
  const [categoryselect5, Setcategoryselect5] = useState(false);
  const [categoryselect6, Setcategoryselect6] = useState(false);
  const [categoryselect7, Setcategoryselect7] = useState(false);
  const [categoryselect8, Setcategoryselect8] = useState(false);
  const [categoryselect9, Setcategoryselect9] = useState(false);
  const [categoryselect10, Setcategoryselect10] = useState(false);
  const [categoryselect11, Setcategoryselect11] = useState(false);
  let arraylist = [
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
  let categoryselect = [
    categoryselect0,
    categoryselect1,
    categoryselect2,
    categoryselect3,
    categoryselect4,
    categoryselect5,
    categoryselect6,
    categoryselect7,
    categoryselect8,
    categoryselect9,
    categoryselect10,
    categoryselect11,
  ];
  let Setcategoryselect = [
    Setcategoryselect0,
    Setcategoryselect1,
    Setcategoryselect2,
    Setcategoryselect3,
    Setcategoryselect4,
    Setcategoryselect5,
    Setcategoryselect6,
    Setcategoryselect7,
    Setcategoryselect8,
    Setcategoryselect9,
    Setcategoryselect10,
    Setcategoryselect11,
  ];
  useEffect(() => {
    props.nowcategory.map((li, key) => {
      Setcategoryselect[key](li);
    });
    window.history.pushState({}, "", "/ai_faiss");
    window.onpopstate = (e) => {
      props.prevLevel();
    };
  }, [props.nowcategory]);
  let arrays = [];
  categoryselect.map((il, key) => {
    const eventts = () => {
      Setcategoryselect[key](!categoryselect[key]);
    };
    arrays[key] = eventts;
  });
  const buttonevent = () => {
    let arraycategory = [...categoryselect];
    if (
      !categoryselect0 &&
      !categoryselect1 &&
      !categoryselect2 &&
      !categoryselect3 &&
      !categoryselect4 &&
      !categoryselect5 &&
      !categoryselect6 &&
      !categoryselect7 &&
      !categoryselect8 &&
      !categoryselect9 &&
      !categoryselect10 &&
      !categoryselect11
    ) {
      return;
    }
    props.Levelcheche(true);
    props.GetCateGoryList(arraycategory);
    props.nextleveltwo();
  };
  return (
    <>
      <div className="item_add item_add_category">
        <div className="item_add_left">
          <h1 className="title">AI 카테고리 데이터</h1>
          <p className="video_small_text">
            기존 AI 카테고리 데이터에서 사용할 카테고리만
            선택해주세요.(중복선택가능)
          </p>
          <div className="category_hierarchy">
            <div>
              <div id="demo">
                <ul>
                  <ul className="tree-menu">
                    {arraylist.map((il, key) => (
                      <>
                        <li onClick={arrays[key]}>
                          {categoryselect[key] == true ? (
                            <>
                              <img
                                className="videocategorylistimg"
                                src={video_add_categoryJ}
                              />
                              <p className="selected">
                                <img
                                  src={arraylist[key].categroyImg}
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
                                  {arraylist[key].categoryName}
                                </span>
                              </p>
                            </>
                          ) : (
                            <>
                              <img
                                className="videocategorylistimg"
                                src={video_add_folder}
                              />
                              <p>
                                <img
                                  src={arraylist[key].categroyImg}
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
                                  {arraylist[key].categoryName}
                                </span>
                              </p>
                            </>
                          )}
                        </li>
                      </>
                    ))}
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="category_select_btn">
          <img src={ic_item_category_select} />
        </button>
        <div className="item_add_left">
          <h1 className="title">선택된 카테고리</h1>
          <p className="video_small_text">
            AI 매치 (디텍션)에 사용할 카테고리를 확인해보세요.
          </p>
          <div className="category_hierarchy">
            <div>
              <div id="demo">
                <ul>
                  <ul class="tree-menu">
                    {arraylist.map((il, key) => (
                      <>
                        <li onClick={arrays[key]}>
                          {categoryselect[key] == true ? (
                            <>
                              <img
                                className="videocategorylistimg"
                                src={video_add_folder}
                              />
                              <p>
                                <img
                                  src={arraylist[key].categroyImg}
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
                                  {arraylist[key].categoryName}
                                </span>
                              </p>
                            </>
                          ) : (
                            <></>
                          )}
                        </li>
                      </>
                    ))}
                  </ul>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="stylenone"></div>
        <div className="stylenone"></div>
        <div className="stylenone"></div>
        <div className="stylenone"></div>
        <button type="bottombutton" onClick={buttonevent}>
          다음
        </button>
      </div>
    </>
  );
};
export default withRouter(VideoAddCategory);
