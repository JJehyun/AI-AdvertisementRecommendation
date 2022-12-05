import React, { useEffect, useState } from "react";
import axios from "axios";
import EditSearchModal from "./edit_search_modal.js";
import FileUpload from "./file_upload.js";
import { withRouter } from "react-router-dom";

import item_insert_level1 from "../../images/common/item_insert_level1.png";
import Question from "../../images/common/icons/ic_question.svg";
import AlertModal from "../../components/alert_modal";
import { getCookie } from "../user/cookies.js";

const ItemAddInsert = (props) => {
  const { level, setLevel, add_data, data } = props;

  const [values, setValues] = useState({
    idx: null,
    title: "",
    description: "",
    price: "",
    url: "",
    tags: "",
    dialogRender: false,
  });
  const [modal, setModal] = useState({ status: false, content: null });
  const [alertMessage, setAlertMessage] = useState(null);
  const [isItem, setIsItem] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [searchItem, setSearchItem] = useState({});
  const [searchTitleRender, setSearchTitleRender] = useState("");

  const [fileModal, setFileModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState({});
  const [files, setFiles] = useState({});
  const [itemCate, setItemCate] = useState([]);
  const boshow_token = getCookie("boshow_token");

  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/item_image/`;

  useEffect(() => {
    search();

    axios.get("/ItemCategoryApi", null).then((response) => {
      setItemCate(response.data);
    });

    if (Object.keys(data).length > 0) {
      setValues({
        idx: data.idx,
        title: data.title,
        description: data.description,
        price: data.price,
        url: data.url,
        tag: data.tag,
        fk_category_idx: data.fk_category_idx,
      });
      setFiles(data.files);
      if (data.idx === null) {
        let render = new FileReader();
        let file = data.files.file_0;
        render.onloadend = () => {
          file = render.result;
          setPreviewUrl({ file_0: render.result });
        };
        render.readAsDataURL(file);
      } else {
        setPreviewUrl({
          file_0: image_path + String(data.idx) + "/item_1.jpg",
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      setIsItem(true);
    } else if (name === "tag") {
      const tags = value.split("#");
      const tagsLength = tags.length - 1;

      for (let i = 1; tagsLength >= i; i++) {
        if (tags[i].length > 4) {
          tags[i] = tags[i].slice(0, 4);
        }
      }

      const tagsJoin = tags.join("#");
      setValues({ ...values, [name]: tagsJoin });
      return;
    }

    if (name === "price") {
      let price = comma(unComma(value));
      setValues({ ...values, [name]: price });
      return;
    }

    setValues({ ...values, [name]: value });
  };

  const comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  };

  const unComma = (str) => {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
  };

  const getItemInfo = () => {
    setModal({ ...modal, status: true });
  };

  const search = () => {
    axios
      .get("/ItemApi", {
        params: { boshow_token: boshow_token, title: searchTitle },
      })
      .then((response) => {
        setSearchTitleRender(searchTitle);
        setSearchItems(response.data);
      });
  };

  const chooseItem = (e) => {
    const { value } = e.target;

    const load_item = document.getElementsByName("load_item");
    load_item.forEach((item) => {
      item.checked = false;
    });
    e.target.checked = true;

    setSearchItem(searchItems[value]);
  };

  const loadItem = async () => {
    if (Object.keys(searchItem).length > 0) {
      let tag = "";
      let hash = "#";
      await axios
        .get("/ItemTagApi", { params: { item_idx: searchItem.idx } })
        .then((response) => {
          response.data.filter((data, key) => {
            if (key == 1) {
              hash = " #";
            }
            tag = tag + hash + data.tag;
          });
        });

      let now_select_idx = 0;
      let now_select_level = 0;
      let category = 0;
      for (let i = 0; i < 4; i++) {
        category = searchItem["fk_category_level" + String(i)];
        if (category == 0) {
          break;
        }
        now_select_idx = category;
        now_select_level++;
      }
      now_select_level--;

      setValues({
        idx: searchItem.idx,
        title: searchItem.title,
        description: searchItem.description,
        price: searchItem.price,
        url: searchItem.url,
        tag: tag,
        fk_category_idx: {
          level_0: searchItem.fk_category_level0,
          level_1: searchItem.fk_category_level1,
          level_2: searchItem.fk_category_level2,
          level_3: searchItem.fk_category_level3,
          now_select_idx: now_select_idx,
          now_select_level: now_select_level,
        },
      });
      setFiles({ file_0: false });
      setPreviewUrl({
        file_0: image_path + String(searchItem.idx) + "/item_1.jpg",
      });
    }

    closeModal();
  };

  // 중복 확인
  const checkTitle = () => {
    axios
      .get("/ItemApi", { params: { title: values.title } })
      .then((response) => {
        if (response.data) {
          if (response.data.length > 0 && values.title !== searchItem.title) {
            setAlertMessage("이미 존재하는 상품명입니다.");
            setIsItem(true);
          } else {
            setAlertMessage(
              "중복되는 상품명이 없습니다.계속 진행하고 싶다면 확인버튼을 눌러주세요."
            );
            setIsItem(false);
          }
        }
      });
  };

  const handleFile = () => {
    setFileModal(!fileModal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let tags = values.tag?.replace(/(\s*)/g, "");
    let isTag = tags?.split("#");

    if (Object.keys(files).length === 0) {
      return alert("이미지를 등록해 주세요.");
    } else if (isItem && values.idx === null) {
      return alert("중복 확인해 주세요.");
    } else if (isTag?.length === 1 && isTag[0] !== "") {
      return alert("태그를 #으로 구분하여 입력해주세요 \n ex)#옷 #바지");
    }

    add_data({
      idx: values.idx,
      files: files,
      title: values.title,
      description: values.description,
      price: values.price,
      url: values.url,
      tag: values.tag,
      fk_category_idx: values.fk_category_idx,
    });
    setLevel(level + 1);
  };

  const closeModal = () => {
    setModal({ ...modal, status: false });
  };

  const handleDialogRender = (e) => {
    if (e.type === "mouseover") {
      setValues({
        ...values,
        dialogRender: true,
      });
    } else {
      setValues({
        ...values,
        dialogRender: false,
      });
    }
  };

  const DialogBox = () => {
    return (
      <span
        style={{
          display: `${values.dialogRender ? "inline-block" : "none"}`,
          zIndex: 10,
          position: "absolute",
          fontSize: "12px",
          border: "0.5px solid #ffffff",
          borderRadius: "5px",
          boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.16)",
          background: "#ffffff",
          color: "#b4b4b4",
          padding: "9px 25px 9px 21px",
          top: "75px",
          left: "480px",
        }}
      >
        등록된 상품 중 비슷한 상품을 불러오고 싶다면
        <br />
        불러오기 버튼을 눌러주세요!
      </span>
    );
  };

  return (
    <>
      <div className="item_add">
        <form onSubmit={handleSubmit}>
          <div className="item_image" onClick={handleFile}>
            {previewUrl["file_0"] ? (
              <img
                width="300px"
                src={previewUrl["file_0"]}
                className="image_item_add"
              />
            ) : (
              <div className="no_image_item_add" />
            )}
          </div>
          <table className="">
            <colgroup>
              <col width="115px" />
            </colgroup>
            {
              <tr>
                <th>
                  정보 불러오기
                  <img
                    src={Question}
                    alt="question"
                    style={{ top: "5px", position: "relative" }}
                    onMouseOver={handleDialogRender}
                    onMouseOut={handleDialogRender}
                  />
                  <DialogBox />
                </th>
                <td>
                  <button
                    type="button"
                    className="item_add_load_btn"
                    onClick={getItemInfo}
                  >
                    상품정보 불러오기
                  </button>
                </td>
              </tr>
            }
            <tr>
              <th>상품명</th>
              <td className="item_add_title">
                <input
                  type="text"
                  name="title"
                  maxLength={28}
                  value={values.title}
                  onChange={handleChange}
                  placeholder="공백제외 총 28자 내로 입력해주세요."
                />
                <button
                  type="button"
                  style={
                    values.title.length > 0
                      ? { backgroundColor: "#7c38ff" }
                      : {}
                  }
                  onClick={checkTitle}
                  disabled={values.title ? false : true}
                >
                  중복확인
                </button>
              </td>
            </tr>
            <tr>
              <th>판매가</th>
              <td className="middle_input">
                <input
                  type="text"
                  className="item_add_price"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                />{" "}
                원
              </td>
            </tr>
            <tr>
              <th>상품 특징</th>
              <td>
                <input
                  type="text"
                  className="item_add_explanation"
                  name="description"
                  maxLength={10}
                  value={values.description}
                  onChange={handleChange}
                  placeholder="ex)20% 할인, 공백 제외 최대 10자 이내로 입력해주세요"
                />
              </td>
            </tr>
            <tr>
              <th>URL</th>
              <td className="item_add_URL">
                <input
                  type="text"
                  className=""
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <th>상품태그</th>
              <td>
                <input
                  type="text"
                  className=""
                  name="tag"
                  value={values.tag}
                  onChange={handleChange}
                  placeholder="태그당 최대 4자 이내로 입력해주세요"
                />
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <span className="item_add_load">
                  #을 통해 옵션값을 연속적으로 입력하세요. 태그는 최대 4개까지
                  입력할 수 있으며, 플레이어 화면에는 두 개까지만 노출됩니다.
                </span>
              </td>
            </tr>
          </table>
          <input type="submit" className="item_add_submit" value="다음" />
        </form>
      </div>

      {fileModal && (
        <FileUpload
          files={files}
          previewUrl={previewUrl}
          handleFile={handleFile}
          setFiles={setFiles}
          setPreviewUrl={setPreviewUrl}
        />
      )}
      {modal.status && (
        <EditSearchModal
          close={closeModal}
          header="상품정보 불러오기"
          subTitle="불러오기는 최대 1개 상품만 가능합니다."
        >
          <div>
            <main> {props.children} </main>
            <div>
              {searchTitleRender && (
                <div className="searchNotice">
                  <span>'{searchTitleRender}'</span>를 포함한{" "}
                  <span>'{searchItems.length}개'</span> 상품이 검색 되었습니다.
                </div>
              )}

              <div className="search">
                <input
                  name=""
                  type="text"
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="이름을 입력해주세요"
                />
                <button type="button" onClick={search}>
                  검색
                </button>
              </div>

              <div className="result">
                <ul>
                  <li />
                  <li>상품 이미지</li>
                  <li>상품명</li>
                  <li>가격 및 상품정보</li>
                  <li>카테고리</li>
                  {/* <li>카테고리</li> */}
                </ul>
                <table>
                  <colgroup>
                    <col width="6%" />
                    <col width="16%;" />
                    <col width="20%;" />
                    <col width="20%;" />
                    {/* <col width="24%;"/> */}
                  </colgroup>
                  {searchItems.map((item, key) => (
                    <tr key={key}>
                      <td>
                        <input
                          type="checkbox"
                          name="load_item"
                          id={"load_item_" + item.idx}
                          className="get_item_info"
                          value={key}
                          onClick={chooseItem}
                        />
                        <label for={"load_item_" + item.idx}>
                          <span />
                        </label>
                        {/* <input type="checkbox" id={"list" + menu.idx} name="idx" value={menu.idx} onClick={this.handleCheck} checked={this.state.check_video.indexOf(menu.idx) !== -1}/>
                                                <label for={"list" + menu.idx}><span></span></label> */}
                      </td>
                      <td>
                        <img
                          src={
                            `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
                            String(item.idx) +
                            "/item_1.jpg"
                          }
                        />
                      </td>
                      <td className="title">{item.title}</td>
                      <td>
                        가격 : {item.price}원<br />
                        상품특징 : {item.description}
                        <br />
                        URL : {item.url}
                      </td>
                      <td>
                        {
                          <td className="item_list_category">
                            {itemCate.findIndex(
                              (obj) => obj.idx == item.fk_category_level0
                            ) !== -1 ? (
                              <>
                                [대분류]
                                {
                                  itemCate[
                                    itemCate.findIndex(
                                      (obj) =>
                                        obj.idx == item.fk_category_level0
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                            {itemCate.findIndex(
                              (obj) => obj.idx == item.fk_category_level1
                            ) !== -1 ? (
                              <>
                                &gt; [중분류]
                                {
                                  itemCate[
                                    itemCate.findIndex(
                                      (obj) =>
                                        obj.idx == item.fk_category_level1
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                            {itemCate.findIndex(
                              (obj) => obj.idx == item.fk_category_level2
                            ) !== -1 ? (
                              <>
                                &gt; [소분류]
                                {
                                  itemCate[
                                    itemCate.findIndex(
                                      (obj) =>
                                        obj.idx == item.fk_category_level2
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                            {itemCate.findIndex(
                              (obj) => obj.idx == item.fk_category_level3
                            ) !== -1 ? (
                              <>
                                &gt; [상세분류]
                                {
                                  itemCate[
                                    itemCate.findIndex(
                                      (obj) =>
                                        obj.idx == item.fk_category_level3
                                    )
                                  ].name
                                }
                              </>
                            ) : null}
                          </td>
                        }
                      </td>
                    </tr>
                  ))}
                </table>
              </div>

              <div className="btn_line">
                <button type="button" onClick={loadItem}>
                  불러오기
                </button>
              </div>
            </div>
          </div>
        </EditSearchModal>
      )}

      <AlertModal message={alertMessage} setMessage={setAlertMessage} />
    </>
  );
};

export default withRouter(ItemAddInsert);
