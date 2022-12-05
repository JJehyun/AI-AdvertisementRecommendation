import React, { useState, useRef, useEffect, useReducer } from "react";
import ResizableRect from "react-resizable-rotatable-draggable";
import AiSubmit from "./ai_submit.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { numberPad } from "../../components/common";

import ic_ai_edit_prev from "../../images/common/ic_ai_edit_prev.png";
import ic_ai_edit_next from "../../images/common/ic_ai_edit_next.png";
import ic_back_arrow from "../../images/common/ic_back_arrow.png";

const AiEdit = ({ video, item, itemDetail }) => {
  const [items, setItems] = useState([]);
  const [currentItemDetail, setCurrentItemDetail] = useState([]);
  const unit = ["프레임", "초", "분"];
  const [time, setTime] = useState({ unit: 0, currentTime: 1, maxTime: 1 });
  const [itemRect, setItemRect] = useState([]);
  const [updateDetail, setUpdateDetail] = useState(itemDetail);
  const [itemStamp, setItemStamp] = useState([]);
  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
  const make_image_path = image_path + "make_image/";
  const item_image_path = image_path + "item_image/";
  const [currentImage, setCurrentImage] = useState("");
  const [check, setCheck] = useState({ item: null, still: null });
  const [submitModal, setSubmitModal] = useState(false);
  const interval = useRef();
  const imgRef = useRef();
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [frameImg, setFrameImg] = useState([]);

  useEffect(() => {
    let item_list = items;

    // 영상에 등록했던 상품들을 찾아 items에 저장
    itemDetail.filter((data) => {
      const item_idx = data.fk_item_idx;
      if (item_idx !== null && item_list.indexOf(item_idx) === -1) {
        item_list.push(item_idx);
      }
    });
    setItems(item_list);

    // 상품이 있을 경우 선택 (이후 선택된 상품만 표시)
    if (item_list.length === 0) {
      setCheck({ item: 0, still: 0 });
    } else {
      setCheck({ item: item_list[0], still: item_list[0] });
    }

    // setTime({ ...time, maxTime: itemDetail[itemDetail.length - 1].position });
    setTime({ ...time, maxTime: video.total_frame });

    swiperInit();
  }, []);

  // 프레임 별 이미지 드래그
  const swiperInit = () => {
    const swiper = document.querySelector(".swiper-container").swiper;

    swiper.init();
  };

  // 시간이 변경될 때마다
  useEffect(() => {
    // 이미지 변경
    setCurrentImage(
      make_image_path +
        String(video.idx) +
        "/images/" +
        numberPad(time.currentTime * 15, 5) +
        ".jpg"
    );
    // 상품 박스 변경
    changeItemDetail();

    // 프레임 별 이미지 위치 변경(현재 선택된 시간으로)
    const swiper_container = document.querySelector(".swiper-container");
    const swiper_wrapper = document.querySelector(".swiper-wrapper");

    const frame_img = document.getElementById(
      "frame_img" + String(time.currentTime)
    );
    if (frame_img) {
      swiper_container.scrollTo(
        frame_img.offsetLeft -
          swiper_container.offsetLeft +
          parseInt(
            swiper_wrapper.style.transform.split("(")[1].split("px")[0]
          ) +
          30,
        0
      );
    }
  }, [time.currentTime]);

  // 상품 선택할 때마다
  useEffect(() => {
    if (check.item === null) {
      return;
    }
    changeItemDetail();

    // 프로그레스에 상품 위치 다시 표시
    drawStamp();
    setTime({ ...time, currentTime: 1 });
  }, [check.item]);

  useEffect(() => {
    drawItem();
  }, [currentItemDetail]);

  // 이미지 사이즈가 변할 때 (화면 사이즈가 변할 떄)
  useEffect(() => {
    interval.current = setInterval(() => {
      setImgSize({
        width: imgRef.current.offsetWidth,
        height: imgRef.current.offsetHeight,
      });
    }, 500);

    return () => {
      clearInterval(interval.current);
    };
  }, [imgRef]);

  useEffect(() => {
    drawItem();
    drawStamp();
  }, [imgSize]);

  const changeItemDetail = async (reset = false) => {
    await setItemRect([]);
    let current_item_detail = {};

    if (reset) {
      current_item_detail = itemDetail.filter((data) => {
        return (
          data.position == time.currentTime * 15 &&
          data.fk_item_idx == check.item
        );
        // return data.position == time.currentTime;
      });
    } else {
      current_item_detail = updateDetail.filter((data) => {
        return (
          data.position == time.currentTime * 15 &&
          data.fk_item_idx == check.item
        );
        // return data.position == time.currentTime;
      });
    }

    setCurrentItemDetail(current_item_detail);
  };

  // anchor box 데이터 수정
  const editItemDetail = async (editItem) => {
    let index = -1;

    updateDetail.filter((data, key) => {
      if (data.idx === editItem.idx) {
        index = key;
      }
    });

    let update_detail = [...updateDetail];
    update_detail[index] = editItem;

    // update_detail.slice(isItem, 1); remove

    await setUpdateDetail(update_detail);
  };

  // 이미지 위에 anchor box 표시
  const drawItem = () => {
    const video_el = document.getElementById("make_ai_model_draw_img");
    let item_rect = [];

    currentItemDetail.map(async (data) => {
      editItemDetail(data);
      item_rect.push({
        position: "absolute",
        display: "inline-block",
        background: "rgba(0, 0, 0, 0.3)",
        left: data.x * (video_el.width / 1920),
        top: data.y * (video_el.height / 1080),
        width: data.width * (video_el.width / 1920),
        height: data.height * (video_el.height / 1080),
      });
    });

    setItemRect(item_rect);
  };

  // 프로그레스에 상품 위치 표시
  const drawStamp = () => {
    let item_stamp = [];
    const video_time = document.getElementById("video_time");
    const range_left = video_time.offsetLeft;
    const range_top = video_time.offsetTop;
    const range_width = ((video_time.offsetWidth - 18) / time.maxTime) * 15;
    const range_height = video_time.offsetHeight;
    const thumb_width = 9;
    let prev_stamp = null;
    let prev_position = -1;

    let frame_img = [];

    const check_item = updateDetail.filter((data) => {
      if (
        data.fk_item_idx == check.item &&
        prev_position * 15 !== data.position * 15
      ) {
        if (prev_position * 15 + 1 === data.position * 15) {
          prev_stamp = parseFloat(
            item_stamp[item_stamp.length - 1].width.split("px")[0]
          );
          item_stamp[item_stamp.length - 1].width =
            prev_stamp + range_width + "px";
        } else {
          item_stamp.push({
            position: "absolute",
            display: "inline-block",
            background: "rgba(214, 214, 214, 0.4)",
            left:
              range_left +
              range_width * (data.position / 15 - 1) +
              thumb_width +
              "px",
            top: range_top + "px",
            width: range_width + "px",
            height: range_height + "px",
          });
        }

        prev_position = data.position;
        frame_img.push(data.position / 15);
      }
    });

    setItemStamp(item_stamp);
    setFrameImg(frame_img);
  };

  // 시간 변경
  const handleTime = (e) => {
    const current_time = e.target.value;

    setTime({ ...time, currentTime: current_time });
  };

  //이전
  const prev = (frame = false) => {
    let prev_time = parseInt(time.currentTime);
    if (frame) {
      let index = frameImg.indexOf(time.currentTime);
      prev_time = frameImg[index - 10];
    } else {
      prev_time = prev_time - 1;
    }
    if (prev_time > 1) {
      setTime({ ...time, currentTime: prev_time });
    }
  };

  // 다음
  const next = (frame = false) => {
    let next_time = parseInt(time.currentTime);
    if (frame) {
      let index = frameImg.indexOf(time.currentTime);
      next_time = frameImg[index + 10];
    } else {
      next_time = next_time + 1;
    }
    if (next_time < time.maxTime) {
      setTime({ ...time, currentTime: next_time });
    }
  };

  // 초기화
  const resetRect = async () => {
    await changeItemDetail(true);
  };

  const changeUnit = () => {
    setTime({ ...time, unit: time.unit + 1 });
  };

  // anchor box 사이즈 수정
  const handleResize = (style, key) => {
    let { top, left, width, height } = style;

    let item_rect = itemRect;
    const video_el = document.getElementById("make_ai_model_draw_img");

    top = Math.round(top);
    left = Math.round(left);
    width = Math.round(width);
    height = Math.round(height);

    if (left < 0) {
      left = 0;
      width = item_rect[key].width;
    }
    if (top < 0) {
      top = 0;
      height = item_rect[key].height;
    }
    if (left + width > video_el.width) {
      width = item_rect[key].width;
    }
    if (top + height > video_el.height) {
      height = item_rect[key].height;
    }

    let current_item_detail = [...currentItemDetail];
    let ratio_width = 1920 / video_el.width;
    let ratio_height = 1080 / video_el.height;

    current_item_detail[key] = {
      ...current_item_detail[key],
      x: left * ratio_width,
      y: top * ratio_height,
      width: width * ratio_height,
      height: height * ratio_height,
    };

    setCurrentItemDetail(current_item_detail);
  };

  // anchor box 드래그 이동
  const handleDrag = (deltaX, deltaY, key) => {
    let item_rect = itemRect;
    var video_el = document.getElementById("make_ai_model_draw_img");

    let left = item_rect[key].left + deltaX;
    let top = item_rect[key].top + deltaY;

    if (left < 0) {
      left = 0;
    }
    if (top < 0) {
      top = 0;
    }
    if (left + item_rect[key].width > video_el.width) {
      left = item_rect[key].left;
    }
    if (top + item_rect[key].height > video_el.height) {
      top = item_rect[key].top;
    }

    let current_item_detail = [...currentItemDetail];
    let ratio_width = 1920 / video_el.width;
    let ratio_height = 1080 / video_el.height;

    current_item_detail[key] = {
      ...current_item_detail[key],
      x: left * ratio_width,
      y: top * ratio_height,
    };

    setCurrentItemDetail(current_item_detail);
  };

  const handleSubmit = (e) => {
    setSubmitModal(!submitModal);
  };

  return (
    <>
      <div className="make_ai">
        <div className="make_ai_model_edit">
          <div className="make_ai_model_edit_video">
            <span className="make_ai_model_edit_link_video">
              <h1>
                연결된 동영상(AI 박스 편집)
                <span>
                  <button onClick={() => prev(false)}>
                    <img src={ic_ai_edit_prev} />
                  </button>
                  <button onClick={() => next(false)}>
                    <img src={ic_ai_edit_next} />
                  </button>
                  <button className="reset_btn" onClick={changeUnit}>
                    {unit[time.unit]}
                  </button>
                  <button className="reset_btn" onClick={resetRect}>
                    초기화
                  </button>
                </span>
              </h1>
              <span>
                <img
                  id="make_ai_model_draw_img"
                  className="make_ai_model_draw_img"
                  src={currentImage}
                  ref={imgRef}
                />
                {itemRect.map((value, key) => (
                  <ResizableRect
                    key={key}
                    left={value.left}
                    top={value.top}
                    width={value.width}
                    height={value.height}
                    zoomable="n, w, s, e, nw, ne, se, sw"
                    onResize={(style) => {
                      handleResize(style, key);
                    }}
                    onDrag={(deltaX, deltaY) => {
                      handleDrag(deltaX, deltaY, key);
                    }}
                  >
                    <button>X</button>
                  </ResizableRect>
                ))}
                <div className="time_bar">
                  <span className="time">
                    {numberPad(parseInt((time.currentTime * 15) / 1800), 2) +
                      ":" +
                      numberPad(
                        parseInt(((time.currentTime * 15) % 1800) / 30),
                        2
                      )}
                    <input
                      id="video_time"
                      type="range"
                      onChange={handleTime}
                      value={time.currentTime}
                      step={1}
                      min={1}
                      max={time.maxTime / 15}
                    />
                    {/* <div id="item_stamp" /> */}
                    {itemStamp.map((value, key) => (
                      <div key={key} style={value} />
                    ))}
                    {numberPad(parseInt(time.maxTime / 1800), 2) +
                      ":" +
                      numberPad(parseInt((time.maxTime % 1800) / 30), 2)}
                  </span>
                </div>
              </span>
            </span>
            <span className="make_ai_edit_items">
              <h1>전체 상품 보기 (1개씩 편집 가능)</h1>
              <div>
                {items.map((value, key) => (
                  <div key={key}>
                    <input
                      type="checkbox"
                      id={"list" + value}
                      className="time_range"
                      onChange={() => setCheck({ ...check, item: value })}
                      checked={check.item == value}
                    />
                    <label for={"list" + value}>
                      <img src={item_image_path + value + "/item_1.jpg"} />
                    </label>
                  </div>
                ))}
              </div>
            </span>
          </div>

          <div className="make_ai_edit_stillcut">
            <h1>프레임 별 이미지</h1>
            <button onClick={() => prev(true)}>
              <img
                src={ic_back_arrow}
                style={{ transform: "rotate(180deg)" }}
              />
            </button>
            <div className="frame_img_area">
              <Swiper>
                {frameImg.map((value, key) => (
                  <SwiperSlide key={key} id={"frame_img" + value}>
                    <label for={"frame" + value}>
                      <input
                        type="checkbox"
                        id={"frame" + value}
                        onChange={() =>
                          setTime({ ...time, currentTime: value })
                        }
                        checked={time.currentTime == value}
                      />
                      <img
                        src={
                          make_image_path +
                          String(video.idx) +
                          "/images/" +
                          String(value * 15).padStart(5, "0") +
                          ".jpg"
                        }
                      />
                    </label>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button onClick={() => next(true)}>
              <img src={ic_back_arrow} />
            </button>
          </div>
          <button onClick={handleSubmit}>저장</button>
        </div>
      </div>

      {submitModal && (
        <AiSubmit
          video={video}
          handleSubmit={handleSubmit}
          itemDetail={itemDetail}
          updateDetail={updateDetail}
          type="ai_edit"
        />
      )}
    </>
  );
};

export default AiEdit;
