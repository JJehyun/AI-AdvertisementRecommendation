import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../../header.js";
import Managenav from "../../manage_nav.js";

import ic_dashboard_1 from "../../images/common/ic_dashboard_1.png";
import ic_dashboard_2 from "../../images/common/ic_dashboard_2.png";
import ic_dashboard_3 from "../../images/common/ic_dashboard_3.png";

import rankOne from "../../images/rankImage/1.png";
import rankTwo from "../../images/rankImage/2.png";
import rankThree from "../../images/rankImage/3.png";

const OpDashboard = (props) => {
  const [video, setVideo] = useState([]);
  const [advertisement, setAdvertisement] = useState([]);

  useEffect(() => {
    axios.get("/userActionVideoApi", null).then((response) => {
      setVideo(getSort(response.data, (a, b) => b.view - a.view).slice(0, 5));
    });

    axios.get("/userActionItemApi", null).then((response) => {
      if (response.status == 200) {
        setAdvertisement(
          getSort(response.data, (a, b) => b.view - a.view).slice(0, 5)
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
          <li>
            <img src={rankOne} alt="rankOne" />
          </li>
        );
      case 2:
        return (
          <li>
            <img src={rankTwo} alt="rankTwo" />
          </li>
        );
      case 3:
        return (
          <li>
            <img src={rankThree} alt="rankThree" />
          </li>
        );
      default:
        return <li>{rank + 1}</li>;
    }
  };

  const comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  };

  return (
    <>
      <Header mode="operation"></Header>
      <Managenav mode="operation" menu="대시보드" sub="대시보드"></Managenav>
      <section class="content">
        <h1 class="title">
          대시보드
          <span>데이터 부족으로 아직 기능하지 않습니다.</span>
        </h1>
        <div class="dashboard">
          <div class="contents_area">
            <h1 class="title">
              매출통계
              <Link to="/op_analysis">더보기</Link>
            </h1>
            <ul class="product_aggregation">
              <li>
                <span>
                  <img src={ic_dashboard_1} />
                </span>
                <span>
                  <div>오늘의 매출현황</div>
                  <div>104,300원</div>
                </span>
              </li>
              <li>
                <span>
                  <img src={ic_dashboard_2} />
                </span>
                <span>
                  <div>어제의 매출현황</div>
                  <div>304,600원</div>
                </span>
              </li>
              <li>
                <span>
                  <img src={ic_dashboard_3} />
                </span>
                <span>
                  <div>최근 한 주간 매출현황</div>
                  <div>754,700원</div>
                </span>
              </li>
            </ul>
          </div>
          <div class="contents_area">
            <h1 class="title">
              동영상 통계
              <span> (지난 30일 기준)</span>
              <Link
                to={{
                  pathname: "/op_analysis",
                  state: {
                    render: 2,
                  },
                }}
              >
                더보기
              </Link>
            </h1>

            <ul class="item_ranking_column video_ranking_column">
              <li>순위</li>
              <li></li>
              <li>제목</li>
              <li>조회수</li>
            </ul>

            {video.map((v, index) => (
              <ul key={index} class="item_ranking video_ranking">
                <LankRender rank={index} />
                <li>
                  <img
                    src={`${process.env.REACT_APP_BACKEND_HOST}static/videos/${v.idx}_thumbnail.jpg`}
                    alt=""
                  />
                </li>
                <li>
                  <p>{v.title}</p>
                </li>
                <li>{comma(v.view)}</li>
              </ul>
            ))}
          </div>
          <div class="contents_area">
            <h1 class="title">
              상품 통계
              <span> (지난 7일 기준)</span>
              <Link
                to={{
                  pathname: "/op_analysis",
                  state: {
                    render: 2,
                  },
                }}
              >
                더보기
              </Link>
            </h1>
            <ul class="item_ranking_column">
              <li>순위</li>
              <li></li>
              <li>상품명</li>
              <li>클릭수</li>
            </ul>

            {advertisement.map((ad, index) => (
              <ul key={index} class="item_ranking">
                <LankRender rank={index} />
                <li>
                  <img
                    src={`${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/${ad.idx}.jpg`}
                    alt={`${ad.idx}.jpg`}
                  />
                </li>
                <li>
                  <p>{ad.brand}</p>
                  <p>{ad.name}</p>
                </li>
                <li>{comma(ad.view)}</li>
              </ul>
            ))}
          </div>
          {/* <div class="contents_area">
              <h1 class="title">
                <button type="button" class="selected">
                  공지사항
                </button>
                <button type="button">자주하는 질문</button>
                <a>더보기</a>
              </h1>
              <div class="Boshow_guide">
                Boshow 통합 관리 서비스 가이드를 준비중입니다.
              </div>
            </div> */}
        </div>
      </section>
    </>
  );
};

export default OpDashboard;
