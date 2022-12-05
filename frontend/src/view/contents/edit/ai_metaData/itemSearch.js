import React, { useState, useEffect } from "react";
import DatePick from "react-datepicker";
import axios from "axios";
import { searchResetButton, searchSubmitButton } from "./styles";
import { getCookie } from "../../user/cookies";

const ItemSearch = ({ items, setPostHandler, initItem }) => {
  useEffect(() => {
    itemCategory();
  }, []);

  const [searchItemName, setsearchItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    level_0: { idx: undefined, name: "" },
    level_1: { idx: undefined, name: "" },
    level_2: { idx: undefined, name: "" },
    level_3: { idx: undefined, name: "" },
  });
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  /* Category Render State */
  const [level_0, setLevel_0] = useState([{ idx: undefined, name: "" }]);
  const [level_1, setLevel_1] = useState([{ idx: undefined, name: "" }]);
  const [level_2, setLevel_2] = useState([{ idx: undefined, name: "" }]);
  const [level_3, setLevel_3] = useState([{ idx: undefined, name: "" }]);

  const itemCategory = () => {
    axios
      .get("/ItemCategoryApi", {
        params: {
          boshow_token: getCookie("boshow_token"),
          mode: "cate",
        },
      })
      .then((response) => {
        const data = response.data;
        for (let i in data) {
          if (data[i].level == 0) {
            level_0.push({ idx: data[i].idx, name: data[i].name });
          }
          if (data[i].level == 1) {
            level_1.push({ idx: data[i].idx, name: data[i].name });
          }
          if (data[i].level == 2) {
            level_2.push({ idx: data[i].idx, name: data[i].name });
          }
          if (data[i].level == 3) {
            level_3.push({ idx: data[i].idx, name: data[i].name });
          }
        }
        setLevel_0([...level_0]);
        setLevel_1([...level_1]);
        setLevel_2([...level_2]);
        setLevel_3([...level_3]);
      });
  };

  const handleSearchName = (e) => {
    setsearchItemName(e.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const dateformat = (date) => {
    const formatDate = new Date(date);
    const processDate =
      formatDate.getFullYear() +
      "-" +
      (formatDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      formatDate.getDate().toString().padStart(2, "0");

    return processDate;
  };

  const handleChangeCategory = (e) => {
    const { id, value } = e.target;
    
    if (id === "level_0") {
      setSelectedCategory({ ...selectedCategory, level_0: value });
    } else if (id === "level_1") {
      setSelectedCategory({ ...selectedCategory, level_1: value });
    } else if (id === "level_2") {
      setSelectedCategory({ ...selectedCategory, level_2: value });
    } else if (id === "level_3") {
      setSelectedCategory({ ...selectedCategory, level_3: value });
    }
  };

  const handleInit = () => {
    initItem();
    setsearchItemName("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCategory({
      level_0: { idx: undefined, name: "" },
      level_1: { idx: undefined, name: "" },
      level_2: { idx: undefined, name: "" },
      level_3: { idx: undefined, name: "" },
    })
  };

  const handleFilterItems = () => {
    if (startDate != undefined && endDate != undefined) {
      let fDATE =
        startDate.getFullYear() +
        "-" +
        (startDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        startDate.getDate().toString().padStart(2, "0");
      let lDATE =
        endDate.getFullYear() +
        "-" +
        (endDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        endDate.getDate().toString().padStart(2, "0");
      const searchItemData = {
        boshow_token: getCookie("boshow_token"),
        searchtitle: searchItemName ? searchItemName : "",
        searchStartDate: startDate ? fDATE : "",
        searchEndDate: endDate ? lDATE : "",
        level_0: selectedCategory.level_0.idx
          ? parseInt(selectedCategory.level_0.idx)
          : "",
        level_1: selectedCategory.level_1.idx
          ? parseInt(selectedCategory.level_1.idx)
          : "",
        level_2: selectedCategory.level_2.idx
          ? parseInt(selectedCategory.level_2.idx)
          : "",
        level_3: selectedCategory.level_3.idx
          ? parseInt(selectedCategory.level_3.idx)
          : "",
      };
      axios
        .post("/ItemSearchApi", null, { params: searchItemData })
        .then((response) => {
          if (response.status === 200) {
            setPostHandler(response.data);
          }
        });
    } else {
      const searchItemData = {
        boshow_token: getCookie("boshow_token"),
        searchtitle: searchItemName ? searchItemName : "",
        searchStartDate: startDate ? startDate : "",
        searchEndDate: endDate ? endDate : "",
        level_0: parseInt(selectedCategory.level_0)
          ? parseInt(selectedCategory.level_0)
          : "",
        level_1: parseInt(selectedCategory.level_1)
          ? parseInt(selectedCategory.level_1)
          : "",
        level_2: parseInt(selectedCategory.level_2)
          ? parseInt(selectedCategory.level_2)
          : "",
        level_3: parseInt(selectedCategory.level_3)
          ? parseInt(selectedCategory.level_3)
          : "",
      };
      axios
        .post("/ItemSearchApi", null, { params: searchItemData })
        .then((response) => {
          if (response.status === 200) {
            setPostHandler(response.data);
          }
        });
    }
  };

  return (
    <div style={{ border: "1px solid #b4b4b4", width: "100%" }}>
      <div
        style={{
          display: "flex",
          marginBottom: "0.5rem",
          padding: "1rem",
          borderBottom: "1px solid #b4b4b4",
        }}
      >
        <div>
          <label style={{ fontWeight: 600, display: "block" }}>상품명</label>
          <input
            value={searchItemName}
            type="text"
            style={{
              height: "30px",
              width: "150px",
              border: "0.5px solid #b4b4b4",
              margin: "10px 20px 0 0",
            }}
            onChange={handleSearchName}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>날짜</label>
          <div style={{ display: "flex", marginTop: "10px" }}>
            <DatePick
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              maxDate={new Date()}
              shouldCloseOnSelect={true}
              dateFormat="yyyy-MM-dd"
              locale="ko"
            />
            ~
            <DatePick
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              minDate={startDate}
              maxDate={new Date()}
              locale="ko"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem" }}>
        <label
          style={{ fontWeight: 600, marginBottom: "10px", display: "block" }}
        >
          카테고리
        </label>
        <div>
          <select
            id="level_0"
            onChange={handleChangeCategory}
            value={selectedCategory.level_0}
            style={{ width: "130px", height: "30px", marginRight: "10px" }}
          >
            <option selected>대분류</option>

            {level_0.map((category) => (
              <option value={category.idx}>{category.name}</option>
            ))}
          </select>
          <select
            id="level_1"
            onChange={handleChangeCategory}
            value={selectedCategory.level_1}
            style={{ width: "130px", height: "30px", marginRight: "10px" }}
          >
            <option selected>중분류</option>

            {level_1.map((category) => (
              <option value={category.idx}>{category.name}</option>
            ))}
          </select>
          <select
            id="level_2"
            onChange={handleChangeCategory}
            value={selectedCategory.level_2}
            style={{ width: "130px", height: "30px", marginRight: "10px" }}
          >
            <option selected>소분류</option>

            {level_2.map((category) => (
              <option value={category.idx}>{category.name}</option>
            ))}
          </select>
          <select
            id="level_3"
            onChange={handleChangeCategory}
            value={selectedCategory.level_3}
            style={{ width: "130px", height: "30px", marginRight: "10px" }}
          >
            <option selected>상세분류</option>

            {level_3.map((category) => (
              <option value={category.idx}>{category.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: "15px", marginLeft: "320px" }}>
          <input
            style={searchSubmitButton}
            type="submit"
            value="검색"
            onClick={handleFilterItems}
          />
          <button type="reset" onClick={handleInit} style={searchResetButton}>
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemSearch;
