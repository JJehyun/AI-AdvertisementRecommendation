import React, { useEffect, useState } from "react";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";

import ItemAddInsert from "./item_add_insert.js";
import ItemAddCategory from "./item_add_category.js";
import ItemAddPreview from "./item_add_preview.js";

const ItemAdd = (props) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState({});

  useEffect(() => {}, [level]);

  const prev = () => {
    setLevel(level - 1);
  };

  const next = (e) => {
    setLevel(level + 1);
    if (level === 3) {
      props.history.push("/item_list");
    }
  };

  const changeLevel = (level) => {
    if (level > 1 && Object.keys(data).length === 0) {
      return;
    }
    setLevel(level);
  };

  const add_data = (item) => {
    setData(item);
  };

  return (
    <>
      <Header mode="editing" />
      <ManageNav mode="editing" menu="상품" sub_menu="상품 등록" />
      <section className="content">
        <h1 className="title">
          상품 등록
          <span>AI를 제작하기 위한 상품을 등록해주세요!</span>
        </h1>
        <ul className="ed_item_add_level">
          <li
            onClick={() => changeLevel(1)}
            className={level === 1 && "selected"}
          >
            정보등록
          </li>
          <li
            onClick={() => changeLevel(2)}
            className={level === 2 && "selected"}
          >
            카테고리 편집 &amp; 분류
          </li>
          <li
            onClick={() => changeLevel(3)}
            className={level === 3 && "selected"}
          >
            플레이어 정보 등록
          </li>
        </ul>
        {level === 1 && (
          <ItemAddInsert
            level={level}
            setLevel={setLevel}
            add_data={add_data}
            data={data}
          />
        )}
        {level === 2 && (
          <ItemAddCategory
            level={level}
            setLevel={setLevel}
            add_data={add_data}
            data={data}
          />
        )}
        {level === 3 && (
          <ItemAddPreview
            level={level}
            prev={prev}
            next={next}
            data={data}
          />
        )}
      </section>
    </>
  );
};

export default ItemAdd;
