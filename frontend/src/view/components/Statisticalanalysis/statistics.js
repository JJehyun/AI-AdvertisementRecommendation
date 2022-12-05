import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import ic_dashboard_1 from "../../images/common/ic_dashboard_1.png";
import ic_dashboard_2 from "../../images/common/ic_dashboard_2.png";
import ic_dashboard_3 from "../../images/common/ic_dashboard_3.png";

import rankOne from "../../images/rankImage/1.png";
import rankTwo from "../../images/rankImage/2.png";
import rankThree from "../../images/rankImage/3.png";
import {
  sborder,
  smaint,
  smaintg,
  stable1,
  sborder2,
  sttext1,
  sttext2,
  sttext3,
  stitles,
  sviewtext,
  sviewtext2,
} from "./styles";
const Statistics = () => {
  const [video, setVideo] = useState([]);
  const [advertisement, setAdvertisement] = useState([]);
  const [video2, setVideo2] = useState([]);
  const [advertisement2, setAdvertisement2] = useState([]);

  useEffect(() => {
    axios.get("/userActionVideoApi", null).then((response) => {
      setVideo(getSort(response.data, (a, b) => b.view - a.view).slice(0, 5));
    });

    axios.get("/userActionVideoApi", null).then((response) => {
      setVideo2(getSort(response.data, (a, b) => b.view - a.view).slice(5, 10));
    });

    axios.get("/userActionItemApi", null).then((response) => {
      if (response.status == 200) {
        setAdvertisement(
          getSort(response.data, (a, b) => b.view - a.view).slice(0, 5)
        );
      }
    });

    axios.get("/userActionItemApi", null).then((response) => {
      if (response.status == 200) {
        setAdvertisement2(
          getSort(response.data, (a, b) => b.view - a.view).slice(5, 10)
        );
      }
    });
  }, []);

  const getSort = useCallback(
    (e, f) => {
      const topFiveView = e.sort(f);

      return topFiveView;
    },
    [video, advertisement]
  );

  const LankRender = (props) => {
    const { rank } = props;

    switch (rank + 1) {
      case 1:
        return (
          <img
            src={rankOne}
            alt="rankOne"
            style={{ marginBottom: "13px", marginLeft: "50px" }}
          />
        );
      case 2:
        return (
          <img
            src={rankTwo}
            alt="rankTwo"
            style={{ marginBottom: "13px", marginLeft: "50px" }}
          />
        );
      case 3:
        return (
          <img
            src={rankThree}
            alt="rankThree"
            style={{ marginBottom: "13px", marginLeft: "50px" }}
          />
        );
      default:
        return (
          <span
            style={{ fontSize: "24px", marginLeft: "65px", fontWeight: 900 }}
          >
            {rank + 1}
          </span>
        );
    }
  };

  const comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          boxShadow: "0 0 6px 0 rgba(0, 0, 0, 0.12)",
          width: 1300,
        }}
      >
        <div style={sborder}>
          <h1 style={smaint}>
            동영상 통계
            <span style={smaintg}> (지난 30일 기준)</span>
          </h1>

          <table style={stable1}>
            <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
              <td style={sttext1}>순위</td>
              <td style={sttext2}>제목</td>
              <td style={sttext3}>
                조회수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
            </tr>
          </table>
          <table>
            {video.map((v, index) => (
              <tr
                key={index}
                class="item_ranking video_ranking"
                style={{
                  border: "1px solid #e6e6e6",
                  borderTop: "none",
                  borderRight: "none",
                }}
              >
                <td style={{ verticalAlign: "middle" }}>
                  <LankRender rank={index} />
                </td>
                <td>
                  <img
                    src={`${process.env.REACT_APP_BACKEND_HOST}static/videos/${v.idx}_thumbnail.jpg`}
                    alt=""
                    width="130px"
                    height="70px"
                  />
                </td>
                <td style={stitles}>
                  <p>{v.title}</p>
                </td>
                <td style={sviewtext}>{comma(v.view)}</td>
              </tr>
            ))}
          </table>
        </div>
        <div
          style={{
            width: "650px",
            height: "500px",
            backgroundColor: "white",
            borderLeft: "1px solid #e6e6e6",
          }}
        >
          <div
            style={{
              border: "0px solid black",
              backgroundColor: "#ffffff",
              width: "650px",
              marginTop: "15px",
            }}
          >
            <table
              style={{
                marginTop: "61px",
                border: "1px solid #e6e6e6",
                borderLeft: "none",
              }}
            >
              <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                <td style={sttext1}>순위</td>
                <td style={sttext2}>제목</td>
                <td style={sttext3}>
                  조회수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>
              </tr>
            </table>
            <table>
              {video2.map((v, index) => (
                <tr
                  key={index}
                  class="item_ranking video_ranking"
                  style={{
                    border: "1px solid #e6e6e6",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "",
                  }}
                >
                  <td style={{ verticalAlign: "middle" }}>
                    <span
                      style={{
                        fontSize: "24px",
                        marginLeft: "65px",
                        fontWeight: 900,
                      }}
                    >
                      {index + 6}
                    </span>
                  </td>
                  <td>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_HOST}static/videos/${v.idx}_thumbnail.jpg`}
                      alt=""
                      width="130px"
                      height="70px"
                    />
                  </td>
                  <td style={stitles}>
                    <p>{v.title}</p>
                  </td>
                  <td style={sviewtext}>{comma(v.view)}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "30px" }}></div>

      <div
        style={{
          display: "flex",
          width: 1300,
          boxShadow: "0 0 6px 0 rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          style={{
            border: "0px solid black",
            backgroundColor: "#ffffff",
            width: "650px",
            height: "555px",
          }}
        >
          <h1 style={smaint}>
            상품 통계
            <span style={smaintg}> (지난 7일 기준)</span>
          </h1>

          <table style={stable1}>
            <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
              <td style={sttext1}>순위</td>
              <td style={sttext2}>제목</td>
              <td style={sttext3}>
                클릭수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
            </tr>
          </table>
          <table>
            {advertisement.map((v, index) => (
              <tr
                key={index}
                class="item_ranking video_ranking"
                style={{
                  border: "1px solid #e6e6e6",
                  borderTop: "none",
                  borderRight: "none",
                  borderLeft: "none",
                }}
              >
                <td style={{ verticalAlign: "middle" }}>
                  <LankRender rank={index} />
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <img
                    width="50px"
                    height="50px"
                    src={`${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/${v.idx}.jpg`}
                    alt={`${v.idx}.jpg`}
                  />
                </td>
                <td style={stitles}>
                  <p>{v.brand}</p>
                  <p>{v.name}</p>
                </td>
                <td style={sviewtext}>{comma(v.view)}</td>
              </tr>
            ))}
          </table>
        </div>
        <div
          style={{
            width: "650px",
            height: "500px",
            backgroundColor: "white",
            borderLeft: "1px solid #e6e6e6",
          }}
        >
          <div
            style={{
              border: "0px solid black",
              backgroundColor: "#ffffff",
              width: "650px",
              marginTop: "15px",
            }}
          >
            <table
              style={{
                marginTop: "61px",
                border: "1px solid #e6e6e6",
                borderLeft: "none",
              }}
            >
              <tr style={{ borderBottom: "1px solid #e6e6e6" }}>
                <td style={sttext1}>순위</td>
                <td style={sttext2}>제목</td>
                <td style={sttext3}>
                  클릭수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>
              </tr>
            </table>
            <table>
              {advertisement2.map((v, index) => (
                <tr
                  key={index}
                  class="item_ranking video_ranking"
                  style={{
                    border: "1px solid #e6e6e6",
                    borderTop: "none",
                    borderRight: "none",
                  }}
                >
                  <td style={{ verticalAlign: "middle" }}>
                    <span
                      style={{
                        fontSize: "30px",
                        marginLeft: "65px",
                        fontWeight: 900,
                      }}
                    >
                      {index + 6}
                    </span>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <img
                      width="50px"
                      height="50px"
                      src={`${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/${v.idx}.jpg`}
                      alt={`${v.idx}.jpg`}
                    />
                  </td>
                  <td style={stitles}>
                    <p>{v.brand}</p>
                    <p>{v.name}</p>
                  </td>
                  <td style={sviewtext}>{comma(v.view)}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
