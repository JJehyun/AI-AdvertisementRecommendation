import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router-dom";

import ic_video_achive_search from "../../images/common/icons/ic_video_achive_search.png";

import ic_item_category_select from "../../images/common/ic_item_category_select.png";
import { getCookie } from "../user/cookies";

const ItemAddCategory = ({ level, setLevel, add_data, data }) => {
  const [posts, setPosts] = useState([]);
  // const [changePost, setChangePost] = useState([]);
  const boshow_token = getCookie("boshow_token");
  const category_level = ["대분류", "중분류", "소분류", "상세분류"];
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
  
  let [selectArray, selectArraySet] = useState([]);
  let Arrays = []
  useEffect(async () => {
    await get_category();
    if (
      data.fk_category_idx !== undefined &&
      data.fk_category_idx.level_0 !== 0
    ) {
      await setSelectedCategory(data.fk_category_idx);
      await setSelectedCategories([data.fk_category_idx]);
    }
    window.history.pushState("", "", "/item_add");
    window.onpopstate = (e) => {
      setLevel(level - 1);
    };
  }, []);

  const handleOnClick = (e, idx, level) => {
    e.preventDefault();
    if (
      idx == selected_category.now_select_idx &&
      level == 0
    ) {
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
      console.log(selectArray)
        ListOnSet(true);
        setSelectedCategory({
          level_0: selected_category.level_0,
          level_1: selected_category.level_1,
          level_2: selected_category.level_2,
          level_3: idx,
          now_select_idx: idx,
          now_select_level: level,
        });
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

  const category_add = () => {
    axios
      .post("/ItemCategoryApi", null, {
        params: {
          boshow_token: boshow_token,
          idx: selected_category.now_select_idx,
          name: "새 카테고리",
        },
      })
      .then((response) => {
        if (response.status == 200) {
          get_category();
        } else {
          alert("실패");
        }
      });
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
  const category_select = () => {
  
    if (selected_categories == "") {
      Arrays = [...selectArray]
      Arrays.push(selected_category)
      selectArraySet(Arrays)
      setSelectedCategories(Arrays);
    } else {
      Arrays = [...selectArray]
      Arrays.push(selected_category)
      selectArraySet(Arrays)
      setSelectedCategories(Arrays);
    }
  };

  const handleCategoryNameChange = (e, idx) => {
    if (e.target.value != "") {
      const name = e.target.value;
      axios
        .put("/ItemCategoryApi", "", {
          params: { boshow_token: boshow_token, idx: idx, name: name },
        })
        .then((response) => {
          if (response.status == 200) {
            get_category();
          } else {
            alert("서버에러");
          }
        });
    }
  };

  const next_submit = () => {
    add_data({ ...data, fk_category_idx: selectArray});
    setLevel(level + 1);
  };

  const selected_categories_remove = (index, e) => {
    let jeje = [...selectArray]
    jeje.splice(index,1);
    selectArraySet(jeje);

    let _selected_categories = [...selected_categories];
    _selected_categories.splice(index, 1);

    setSelectedCategories(_selected_categories);
  };

  const category = (menu) => (
    <p onDoubleClick={()=>{inputActSet(false)}}
      name={"level_" + menu.level}
      className={selected_category.now_select_idx == menu.idx && "selected"}
      onClick={(e) => handleOnClick(e, menu.idx, menu.level)}
    >
      <FontAwesomeIcon
        icon={
          selected_category.now_select_idx == menu.idx ? faFolderOpen : faFolder
        }
      />
      {"(" + category_level[menu.level] + ")"}
      {inputAct == true ? <input type="text" placeholder={menu.name} onBlur={(e) => handleCategoryNameChange(e, menu.idx)} disabled /> : <input type="text" placeholder={menu.name} fou onBlur={(e) => {handleCategoryNameChange(e, menu.idx);inputActSet(true)}} /> }
    </p>
  );

  const category_list_level_4 = (idx) => {
    return posts.map((menu, key) => (
      <>
        {menu.level == 3 && menu.parent == idx && (
          <ul>
            <li>{category(menu)}</li>
          </ul>
        )}
      </>
    ));
  };
  const category_list_level_3 = (idx) => {
    if(ListOn){
      return posts.map((menu, key) => (
        <>
          {menu.level == 2 && menu.parent == idx && (
            <ul>
              <li>
                {category(menu)}
                {
                  category_list_level_4(menu.idx)}
              </li>
            </ul>
          )}
        </>
      ));
    }else{
      return posts.map((menu, key) => (
        <>
          {menu.level == 2 && menu.parent == idx && (
            <ul>
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
    if(ListThree){
      return posts.map((menu, key) => (
        <>
          {menu.level == 1 && menu.parent == idx && (
            <ul>
              <li>
                {category(menu)}
                {category_list_level_3(menu.idx)}
              </li>
            </ul>
          )}
        </>
      ));
    }else{
      return posts.map((menu, key) => (
        <>
          {menu.level == 1 && menu.parent == idx && (
            <ul>
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
      {menu.level == 0 &&(
        <li>
          {category(menu)}
          {selected_category.level_0 == menu.idx &&
            selected_category.now_select_level >= menu.level && 
            category_list_level_2(menu.idx)}
        </li>
      )}
    </>
  ));

  const select_category_list = selected_categories.map((category, key) => (
    <>
      <div>
        {category.level_0
          ? "(대분류) " +
            posts[posts.findIndex((obj) => obj.idx == category.level_0)].name
          : null}
        {category.level_1 == 0 &&category.level_2 !=0?" > (중분류) " +
            posts[posts.findIndex((obj) => obj.idx == category.level_0)+1].name :null}
        {category.level_1
          ? " > (중분류) " +
            posts[posts.findIndex((obj) => obj.idx == category.level_1)].name
          : null}
        {category.level_2 == 0 && category.level_3 !=0 && category.level_1 === 0 ?" > (중분류) " +
            posts[posts.findIndex((obj) => obj.idx == category.level_0)+1].name :null}
        {category.level_1 == 0 && category.level_3 !=0 && category.level_2 ===0?" > (소분류) " +
            posts[posts.findIndex((obj) => obj.idx == category.level_0)+2].name :null}
        {category.level_2
          ? " > (소분류) " +
            posts[posts.findIndex((obj) => obj.idx == category.level_2)].name
          : null}
        {category.level_0 && category.level_1 && category.level_3 &&category.level_2 == 0?" > (소분류) " +posts[posts.findIndex((obj) => obj.idx == category.level_3)-1].name :null}
        {category.level_3
          ? " > (상세분류) " +
            posts[posts.findIndex((obj) => obj.idx == category.level_3)].name
          : null}
        <button type="button" onClick={() => selected_categories_remove(key)}>
          X
        </button>
      </div>
    </>
  ));

  return (
    <>
      <div className="item_add item_add_category">
        <div className="item_add_left">
          <h1 className="title">편집 &amp; 수정</h1>
          <p className="category_name_change">
            * 기존 카테고리명 / 등록된 카테고리명 변경은 해당 카테고리 더블클릭
            후 변경해주세요.
          </p>
          <div className="category_name_search">
            <input type="text" placeholder="카테고리명을 검색해보세요." />
            <img src={ic_video_achive_search} />
          </div>
          <div className="category_hierarchy">
            <div>
              <div id="demo">
                <ul class="tree-menu">{category_list}</ul>
              </div>
            </div>
            <div className="category_hierarchy_btn_line">
              {/* <button type="button" onClick={category_name_save}>
                                카테고리 이름 저장
                            </button> */}
              <button type="button" onClick={category_add}>
                추가
              </button>
              <button type="button" onClick={category_delete}>
                삭제
              </button>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={category_select}
          className="category_select_btn"
        >
          <img src={ic_item_category_select} />
        </button>
        <div className="item_add_right" style={{width:"55%"}}>
          <h1 className="title">
            선택된 카테고리
            <span>상품을 진열하려면 1개 이상의 분류를 선택해주세요.</span>
          </h1>
          <div className="select_category_list" style={{width:"598px"}}>
            {selected_categories.length !== 0 ? select_category_list : null}
            {/* // select_category_list : null} */}
            {/* <div>(대분류) 아우터,(중분류) 바지,(소분류) 슬랙스,(상세분류) 지오다노 <span>X</span></div> */}
            {/* <div>(대분류) 신발,(중분류) 겨울신발,(소분류) 앵클부츠,(상세분류) 금강제화 <span>X</span></div> */}
          </div>
        </div>
        <button type="button" onClick={next_submit}>
          다음
        </button>
      </div>
    </>
  );
};

export default withRouter(ItemAddCategory);