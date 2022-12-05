import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import qs from "qs"
import no_img from "../../images/common/no_item.png";

import item_insert_level3 from "../../images/common/item_insert_level3.png";
import axios from "axios";
import { getCookie } from "../user/cookies";

const ItemAddPreview = (props) => {
  const { level, prev, next, data } = props;

  const [values, setValues] = useState(data);
  const [image_file, setImageFile] = useState();

  const [type, setType] = useState("B");
  const boshow_token = getCookie("boshow_token");

  useEffect(() => {
    window.history.pushState("", "", "/item_add");
    window.onpopstate = (e) => {
      prev();
    };
  }, []);

  useEffect(() => {
    if (!values.files["file_0"]) {
      setImageFile(
        `${process.env.REACT_APP_BACKEND_HOST}static/item_image/` +
          String(values.idx) +
          "/item_1.jpg"
      );
    } else {
      let render = new FileReader();
      let file = values.files.file_0;
      render.onloadend = () => {
        file = render.result;
        setImageFile(render.result);
      };
      render.readAsDataURL(file);
    }
  }, [values.files["file_0"]]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (e) => {
    e.preventDefault();

    let files = values.files;
    files[e.target.name] = e.target.files[0];

    setValues({ ...values, files: files });
  };

  const handleSubmit = (e) => {
    let tags = values.tag.replace(/(\s*)/g, "");
    tags = tags.split("#");

    if (tags.length === 1 && tags[0] !== "") {
      return alert("태그를 #으로 구분하여 입력해주세요 \n ex)#옷 #바지");
    }
    tags.splice(0, 1);

    var formData = new FormData();
    let key = Object.keys(values.files);
    for (let i in key) {
      formData.append("files", values.files["file_" + i]);
    }
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("url", values.url);
    // formData.append("cate_idx", values.fk_category_idx);
    // formData.append("cate_idx", [1, 2, 3, 4, 5]);
    formData.append("asdasd",values.fk_category_idx);
    values.fk_category_idx.map((i,key)=>{
      for (let name in i) {
        if (name.split("_")[0] === "level") {
          formData.append(name, i[name]);
          console.log(name+"("+key+")",i[name])
        }
      }
    })
    formData.append("tag", tags);

    let params = {};
    if (values.idx !== null) {
      formData.append("item_idx", values.idx);

      params = {
        method: "put",
        url: "/ItemApi",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    } else {
      formData.append("boshow_token", boshow_token);

      params = {
        method: "post",
        url: "/ItemApi",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    }

    axios(params).then((response) => {
      if (!response.data) {
        return alert("해당 상품이 존재하지 않습니다.");
      }
      alert("상품 등록 성공");
      props.history.push("/item_list");
      window.location.reload();
    });
    setTimeout(tete, 500);
  };
  const tete = ()=>{
    axios.get("/CatagoryJE",{params: {"asdasd":values.fk_category_idx}}).then((response)=>{console.log(response)})
  }
  return (
    <>
      <div className="item_add item_add_preview">
        <div className="item_add_preview_left">
          <p>등록 이미지</p>
          <div>
            <input
              type="file"
              name="file_0"
              onChange={handleFileChange}
              id="item_add_preview_img"
            />
            <label for="item_add_preview_img">
              <img src={image_file ? image_file : no_img}></img>
            </label>
            <table>
              <tr>
                <th>상품태그</th>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="#태그 #태그"
                    name="tag"
                    value={values.tag}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <th>상품명</th>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="공백 제외 총 14자 이내로 입력해주세요"
                    name="title"
                    value={values.title}
                  />
                </td>
              </tr>
              <tr>
                <th>판매가</th>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    value={values.price}
                    name="price"
                    onChange={handleChange}
                  />{" "}
                  원
                </td>
              </tr>
              <tr>
                <th>상품특징</th>
              </tr>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="ex) 20% 할인, 공백 제외 최대 10자 이내로 입력해주세요"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="item_add_preview_right">
          <p>미리보기</p>
          <div className="preview">
            <div>
              <button
                type="button"
                onClick={() => setType("B")}
                className={type == "B" ? "selected" : null}
              >
                상품정보
              </button>
              <button
                type="button"
                onClick={() => setType("D")}
                className={type == "D" ? "selected" : null}
              >
                끌어보쇼
              </button>
            </div>
            <div className={type == "B" ? "B_type_advertise" : "hide"}>
              <span className="B_type_side_mini"></span>
              <div>
                <img src={image_file ? image_file : no_img}></img>
                {values.tag && <div className="B_type_hash_tag">
                  <button type="button">
                    {values.tag.split("#")[1]
                      ? "#" + values.tag.split("#")[1]
                      : "#태그"}
                  </button>
                  <button type="button">
                    {values.tag.split("#")[2]
                      ? "#" + values.tag.split("#")[2]
                      : "#태그"}
                  </button>
                </div>}
                <ul className="B_type_info">
                  <li>{values.title}</li>
                  <li>{values.price}원</li>
                  <li>{values.description}</li>
                </ul>
                <ul className="B_type_btn">
                  <li>
                    <button type="button">바로 구매하기</button>
                  </li>
                  <li>
                    <button type="button">자세히 보기</button>
                    <button type="button">♡</button>
                  </li>
                </ul>
              </div>
              <div className="B_type_add"></div>
            </div>
            <div className={type == "D" ? "D_type_advertise" : "hide"}>
              <li>
                <button>
                  <img src={no_img}></img>
                  <div className="D_type_hash_tag">
                    <button type="button">#태그</button>
                    <button type="button">#태그</button>
                  </div>
                  <div>상품명</div>
                </button>
              </li>
              <li>
                <button>
                  <img src={no_img}></img>
                  <div className="D_type_hash_tag">
                    <button type="button">#태그</button>
                    <button type="button">#태그</button>
                  </div>
                  <div>상품명</div>
                </button>
              </li>
              <li>
                <button>
                  <img src={no_img}></img>
                  <div className="D_type_hash_tag">
                    <button type="button">#태그</button>
                    <button type="button">#태그</button>
                  </div>
                  <div>상품명</div>
                </button>
              </li>
              <li>
                <button>
                  <img src={no_img}></img>
                  <div className="D_type_hash_tag">
                    <button type="button">#태그</button>
                    <button type="button">#태그</button>
                  </div>
                  <div>상품명</div>
                </button>
              </li>
              <li>
                <button>
                  <img src={no_img}></img>
                  <div className="D_type_hash_tag">
                    <button type="button">#태그</button>
                    <button type="button">#태그</button>
                  </div>
                  <div>상품명</div>
                </button>
              </li>
              <li>
                <button>
                  <img src={image_file ? image_file : no_img}></img>
                  {values.tag && <div className="D_type_hash_tag">
                    <button type="button">
                      {values.tag.split("#")[1]
                        ? "#" + values.tag.split("#")[1]
                        : "#태그"}
                    </button>
                    <button type="button">
                      {values.tag.split("#")[2]
                        ? "#" + values.tag.split("#")[2]
                        : "#태그"}
                    </button>
                  </div>}
                  <div>{values.title}</div>
                </button>
              </li>
            </div>
          </div>
        </div>
        <button type="button" onClick={handleSubmit}>
          등록
        </button>
      </div>
    </>
  );
};

export default withRouter(ItemAddPreview);