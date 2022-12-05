import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import VideoPlayer from "./video_player.js";
import VideoBox from "./ai_model_TC/videobox";

const AiSubmit = (props) => {
  const {
    video,
    handleSubmit,
    itemDetail,
    updateDetail,
    type,
    item,
    tcTimeList,
  } = props;
  const TCChceckPlayerPath = "http://localhost:3000/TCCheck_player";
  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
  const item_image_path = image_path + "item_image/";

  //console.log(data.filter(function(rowData){ return data.TYPE == "A"}));

  const Submit = async () => {
    if (type === "ai_edit") {
      await itemDetail.filter((item_detail, key) => {
        let update_item_detail = updateDetail[key];
        const params = {
          idx: update_item_detail.idx,
          x: update_item_detail.x,
          y: update_item_detail.y,
          width: update_item_detail.width,
          height: update_item_detail.height,
        };

        if (
          item_detail.x !== params.x ||
          item_detail.y !== params.y ||
          item_detail.width !== params.width ||
          item_detail.height !== params.height
        ) {
          axios
            .put("/ItemDetail", null, { params: params })
            .then((response) => {
              console.log(1);
            });
        }
      });
    } else if (type === "ai_TC") {
      axios
        .post("TCTimeApi", null, {
          params: { videoIdx: video, itemIdx: convertToItemIdx(), TCTime: tcTimeList },
        })
        .then(() => {
          
        })
        .catch((err) => {
          console.log(err);
        });
    }

    props.history.push("/video_list");

    // code 414, message Request-URI Too Long
    // axios.put('/ItemDetail', null, {params: {"item_detail": itemDetail}})
    // .then(response => {
    //     // props.history.push('/video_list');
    // })
  };

  const convertToItemIdx = () => {
    const itemIdx = item.map(data => {
      return data.idx
    }) 

    return itemIdx
  }

  return (
    <div className="modal ai_submit videocheckmodal">
      {type == "ai_edit" && (
        <div className="ai_edit_form">
          <div className="ai_edit_header">AI 편집 확인</div>
          <div className="ai_edit_preview">
            <VideoPlayer
              video={video}
              itemDetail={updateDetail}
              _videoWidth={743}
            />
            <div>
              <div>
                <button onClick={handleSubmit}>재편집</button>
                <button onClick={Submit}>완료</button>
              </div>
              <span>
                재생바를 움직여 동영상의 AI 구간을 확인할 수 있습니다.
                <br />
                추가로 편집을 원하신다면 재편집 버튼을 눌러 AI 만들기로
                <br />
                되돌아갈 수 있습니다.
              </span>
            </div>
          </div>
        </div>
      )}

      {type == "ai_metadata" && (
        <div className="ai_metadata_form">
          <div className="ai_metadata_header">연결 상품 확인</div>
          <div className="ai_metadata_preview">
            <VideoPlayer
              video={video}
              itemDetail={updateDetail}
              _videoWidth={650}
            />
            <div>
              <div className="make_ai_modeling_item">
                <p>연결된 상품</p>
                <div className="item_container">
                  {item.map((value, i) => (
                    <label for={"list" + value} key={i}>
                      <img
                        style={{ height: "100px", margin: "0 20px 20px 20px" }}
                        className="make_ai_model_draw_img"
                        src={item_image_path + value + "/item_1.jpg"}
                      />
                    </label>
                  ))}
                </div>
                {props.children}
              </div>
              <div>
                <button onClick={handleSubmit}>재연결</button>
                <button onClick={Submit}>완료</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "ai_TC" && (
        <div className="ai_edit_form">
          <div className="ai_edit_header">TC 확인</div>
          <div className="ai_edit_preview" style={{ paddingLeft: "40px" }}>
            <iframe
              className="active"
              src={
                TCChceckPlayerPath +
                "?video_idx=" +
                video.toString() +
                "&tclist=" +
                JSON.stringify(tcTimeList) +
                "&item=" +
                JSON.stringify(convertToItemIdx())
              }
              width="735"
              height="432"
              title="preview"
            ></iframe>
            <div>
              <div>
                <button onClick={handleSubmit}>재편집</button>
                <button onClick={Submit}>완료</button>
              </div>
              <span
                style={{
                  display: "block",
                  margin: "15px 0",
                  position: "relative",
                  left: "20px",
                  fontSize: "12px",
                }}
              >
                상단의 버튼을 클릭하여 동영상의 TC구간을 확인할 수 있습니다.
                <br />
                TC 수정 및 추가를 원할 경우 재편집 버튼을 눌러주세요.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(AiSubmit);
