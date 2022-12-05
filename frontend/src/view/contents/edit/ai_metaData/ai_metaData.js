import React, { useState, useEffect, useCallback } from "react";
import AiSubmit from "../ai_submit.js";
import video_add_categoryJ from "../../../images/common/video_add_categoryJ.png";
import ItemSearch from "./itemSearch";
import ItemModal from "./itemModal";
import axios from "axios";
import video_add_foler from "../../../images/common/video_add_folder.png";

import {
  item_Add_Categoty,
  item_add_left,
  title,
  categoryDialog,
  category_hierarchy,
  listStyle,
  videoTag,
  listValue,
  match_categoryUl,
  match_categorydiv,
  match_categoryimg,
  match_categoryP,
  match_categoryli,
  match_categoryli_p,
  match_categoryul_smalltext,
  itemListTop,
  itemListtd,
  itemListbodytr,
  itemListTBODYTD,
  itemListIMG,
  DataConnectButton,
  ConnectCheckButton,
  flexboxBottom,
  notlistValue,
  sec_itemListbodytr,
} from "./styles";

const AiMetadata = ({
  category,
  match,
  video,
  setMatch,
  prevLevel,
  aieditapi,
  nextLevel,
  getposts,
  postss,
}) => {
  const server = `//222.108.186.236:8000`
  const [posts, setPosts] = useState([{}]);

  const categoryName = [
    "상의",
    "하의",
    "치마",
    "신발",
    "모자",
    "골프공",
    "골프가방",
    "골프클럽",
    "마스크",
    "드레스",
    "코트",
    "시계",
  ];
  const [selectCategory, setSelectCategory] = useState(null);
  const [selectMatch, setSelectMatch] = useState([
    {
      key: undefined,
      imagePath: "",
    },
  ]);
  const [selectItem, setSelectItem] = useState({});
  const [modal, setmodal] = useState({});

  const [updateDetail, setUpdateDetail] = useState();
  const [submitModal, setSubmitModal] = useState(false);
  const [item, setItem] = useState([]);
  const [reRendering, setReRendering] = useState(false);
  const [dataConnecting, setDataConnecting] = useState(false);
  const [dataCheck, setdataCheck] = useState(false);

  const closemodal = () => {
    setSubmitModal(false);
    test();
  };

  useEffect(() => {
    setPosts(postss);
    requestItem();
    category.some((isCategory, key) => {
      setSelectCategory(key);
      return isCategory;
    });
    window.history.pushState({}, "", "/ai_faiss");
    window.onpopstate = (e) => {
      prevLevel();
    };
  }, []);

  const closeview = () => {
    setmodal(modal.idx == undefined);
  };

  const CallEdit = () => {
    aieditapi(updateDetail, item[0]);
    nextLevel();
  };

  const requestItem = () => {
    axios.get("/ItemApi", null).then((response) => {
      if (response.status == 200) {
        setPosts(response.data);
      }
    });
  };

  const handleMetaCategory = useCallback(
    (key, imagePath) => {
      const selectMatchCopy = [...selectMatch];

      const index = selectMatch.findIndex((matchData) => {
        return matchData.key === key;
      });

      if (index <= -1) {
        selectMatchCopy.push({ key, imagePath });
      } else {
        selectMatchCopy.splice(index, 1);
      }

      setSelectMatch(selectMatchCopy);
    },
    [selectMatch]
  );

  const ItemTree = ({ itemIdx }) => {
    const selectedItem = posts.filter((post) => {
      return post.idx == itemIdx;
    });

    return (
      selectedItem[0] && (
        <li style={match_categoryli}>
          <div style={{ display: "flex" }}>
            <img
              style={{ width: "40px", height: "40px" }}
              src={
                `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
                String(selectedItem[0].idx) +
                "/item_1.jpg"
              }
            />
            <span style={match_categoryli_p}>{selectedItem[0].title}</span>
          </div>
        </li>
      )
    );
  };

  const selectCategoryhandler = useCallback(
    (key) => {
      setSelectCategory(key);
      setSelectMatch([{}]);
    },
    [selectCategory, selectMatch]
  );

  const handleClickItem = useCallback(
    (itemIdx) => {
      setSelectItem(itemIdx);
    },
    [selectItem]
  );

  const MetaCategory = selectCategory !== null &&
    Object.keys(match).length !== 0 && (
      <div style={match_categorydiv}>
        {match[`category_${String(selectCategory)}`].map((data, key) => (
          <div>
            <ul key={key} style={match_categoryUl}>
              <div style={{ display: "flex" }} className="boshow_check">
                <input
                  style={{ display: "none" }}
                  type="checkbox"
                  id={`match_${key}`}
                  name="check_box"
                  value={key}
                  onClick={() => handleMetaCategory(key, data["imagePath"])}
                  checked={
                    selectMatch &&
                    selectMatch.findIndex((matchData) => {
                      return matchData.key === key;
                    }) !== -1
                  }
                />
                <label
                  style={{
                    display: "inline-block",
                    width: "17px",
                    height: "17px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    border: "1px solid",
                    position: "relative",
                    margin: "25px 15px 0 0",
                  }}
                  htmlFor={`match_${key}`}
                >
                  <span />
                </label>
                <img
                  src={server + data["imagePath"] + data["imageName"]}
                  style={match_categoryimg}
                />
                <p style={match_categoryP}>
                  카테고리
                  <p style={{ color: "#707070", fontSize: "12px" }}>
                    <span style={match_categoryul_smalltext}>
                      {categoryName[selectCategory]}
                    </span>
                  </p>
                </p>
              </div>
              {data.item ? <ItemTree itemIdx={data.item} /> : <></>}
            </ul>
          </div>
        ))}
      </div>
    );

  const item_list = posts.map((menu) => (
    <tr
      style={menu.idx === selectItem ? sec_itemListbodytr : itemListbodytr}
      key={menu.idx}
    >
      <td style={itemListTBODYTD} className="boshow_check">
        <input
          type="checkbox"
          id={"list" + menu.idx}
          name="check_box"
          value={menu.idx}
          onClick={() => handleClickItem(menu.idx)}
          // checked={true}
          checked={menu.idx === selectItem}
          className="checkBoxImage"
        />
        <label for={"list" + menu.idx}>
          <span className={menu.idx === selectItem ? "label_input_img" : null}>
            {" "}
          </span>
        </label>
      </td>
      <td>{menu.idx}</td>
      <td>
        <img
          onClick={() => {
            setmodal(menu);
          }}
          width="70px"
          height="70px"
          src={
            `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
            menu.idx +
            "/item_1.jpg"
          }
          alt=""
          style={itemListIMG}
        ></img>
        <span className="list_description">
          <p>{menu.title}</p>
          <p className="video_list_explanation">{menu.description}</p>
        </span>
      </td>
    </tr>
  ));

  const ItemTable = (
    <div className="video_list" style={{ height: "290px", padding: "15px" }}>
      <div style={{ display: "block", overflow: "auto", height: "234px" }}>
        <table className="table-library">
          <colgroup>
            <col width="50px" />
            <col width="50px" />
            <col width="500px" />
          </colgroup>
          <thead>
            <tr style={itemListTop}>
              <th style={itemListtd}>
                {
                  <>
                    <input type="checkbox" id="list_check_all" name="all" />
                    <label for="list_check_all">
                      <span></span>
                    </label>
                  </>
                }
              </th>
              <th>번호</th>
              <th>상품명</th>
            </tr>
          </thead>
          <tbody>{item_list}</tbody>
        </table>
      </div>
    </div>
  );

  const SelectedCategoryRender = () => {
    return category.map(
      (isCategory, key) =>
        isCategory && (
          <li style={listStyle} key={key}>
            <img
              style={videoTag}
              src={
                key !== selectCategory ? video_add_foler : video_add_categoryJ
              }
            />
            <p
              style={key !== selectCategory ? listValue : notlistValue}
              onClick={() => {
                selectCategoryhandler(key);
              }}
            >
              {categoryName[key]}
            </p>
          </li>
        )
    );
  };

  const handleDataConnection = () => {
    setdataCheck(true);
    setDataConnecting(true);
    const connData = selectMatch.map((match) => {
      return match.imagePath;
    });

    const macthCategory = match["category_" + String(selectCategory)];

    macthCategory.filter((matchData) => {
      if (connData.includes(matchData.imagePath)) {
        matchData.item = selectItem;
      }
    });

    setReRendering(!reRendering);

    const params = {
      ConnData: connData,
      itemIdx: selectItem,
    };

    axios
      .post("/DataConnetApi", null, { params: params })
      .then((response) => {
        alert("데이터 연결이 완료했습니다.");
        setDataConnecting(false);
        itemSetting();
      })
      .catch((err) => {
        alert("데이터 연결을 실패했습니다.");
      });
  };

  const setPostHandler = (searchPost) => {
    setPosts(searchPost);
  };

  const itemSetting = () => {
    const itemIdx = [];
    for (let item in match) {
      Object.values(match[item.toString()]).map((value) => {
        if (value.item) {
          itemIdx.push(value.item);
        }
      });
    }

    const settingItems = new Set(itemIdx);

    [...settingItems].length > 0 && requestItemDetail(settingItems);
    setItem([...settingItems]);
  };

  const requestItemDetail = async ([...items]) => {
    await axios
      .get("ItemDetail", { params: { video_idx: video.idx, itemIdx: items } })
      .then((response) => {
        console.log(response.data)
        setUpdateDetail(response.data);
      });
  };

  const handleSubmit = () => {
    if (!dataCheck) {
      alert("데이터 연결을 먼저 해주세요");
      return;
    } else {
      itemSetting();
      CallEdit()
      getposts(posts)
    }
  };

  return (
    <div
      style={{
        zIndex: -99,
        width: "1280px",
        overflow: "hidden",
        border: "solid 1px #C3C3C3",
        backgroundColor: "#FFFFFF",
        padding: "10px 15px 70px 15px",
      }}
    >
      <div style={item_Add_Categoty}>
        <div style={item_add_left}>
          <div style={{ display: "flex" }}>
            <div>
              <p style={title}>선택된 데이터</p>
              <p style={categoryDialog}>
                카테고리를 선택하여 AI 배치된 상품을 확인해보세요.
              </p>
            </div>
            <div style={{ marginLeft: "20px" }}>
              <p style={title}>선택된 카테코리 상품 리스트</p>
              <p style={categoryDialog}>
                AI 매치된 상품과 기존 상품을 연결해보세요.
              </p>
            </div>
          </div>
          <div style={category_hierarchy}>
            <div
              style={{
                width: "50%",
                borderRight: "0.5px solid #C3C3C3",
                padding: "22px 0 0 20px",
              }}
            >
              <ul>
                <SelectedCategoryRender />
              </ul>
            </div>
            {MetaCategory}
          </div>
        </div>

        <div style={{ width: "100%", paddingLeft: "5rem" }}>
          <div>
            <p style={title}>연결할 상품</p>
            <p style={categoryDialog}>
              기존 상품을 검색하여 AI 매치된 상품과 연결해보세요.
            </p>
          </div>
          <ItemSearch
            items={posts}
            setPostHandler={setPostHandler}
            initItem={requestItem}
          />

          <div>
            <div style={{ paddingTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  border: "1px solid #c3c3c3",
                  padding: "15px",
                }}
              >
                <p style={{ fontSize: "18px", fontWeight: 600 }}>
                  상품 목록 및 상세검색
                </p>
                <span style={{ marginLeft: "50px", color: "#6b6b6b" }}>
                  전체 {posts.length}개
                </span>
              </div>
              {ItemTable}
            </div>
          </div>
          <div></div>
        </div>
      </div>

      {updateDetail && submitModal && (
        <AiSubmit
          video={video}
          handleSubmit={handleSubmit}
          updateDetail={updateDetail}
          type="ai_metadata"
          item={item}
          closes={closemodal}
        />
      )}

      <div style={flexboxBottom}>
        <div style={{ border: "0px solid red" }}></div>
        <div style={{ display: "flex" }}>
          <button style={DataConnectButton} onClick={handleDataConnection}>
            데이터 연결
          </button>
          <button
            style={ConnectCheckButton}
            onClick={handleSubmit}
            disabled={dataConnecting}
          >
            연결 확인
          </button>
        </div>
      </div>

      {modal.idx != undefined ? (
        <ItemModal modal={modal} events={closeview} />
      ) : null}
    </div>
  );
};

export default AiMetadata;