import React, { useState } from "react";
import {
  chartbackborder,
  chartbackborders,
  chartbox,
  imgbox,
  chartbox2,
  chartstext,
  chartstext3,
  totaltext,
  moneytext,
} from "./styles";
import Charticon from "../../images/common/icons/Charticon.png";
import TVicon from "../../images/common/icons/TVicon.png";

import sales2021 from "../../images/ChartImage/2021년 1월~12월 매출.png";
import sales2022 from "../../images/ChartImage/2022년 1월~12월 매출.png";
import ad2021 from "../../images/ChartImage/2021년 1월~12월 광고.png";
import ad2022 from "../../images/ChartImage/2022년 1월~12월 광고.png";

import sales202112Day from "../../images/ChartImage/2021년 12월 매출 - 일간.png";
import sales202101Day from "../../images/ChartImage/2022년 1월 매출 - 일간.png";
import ad202112Day from "../../images/ChartImage/2021년 12월 광고 - 일간.png";
import ad202201Day from "../../images/ChartImage/2022년 1월 광고 - 일간.png";

const Chart = () => {
  const salesImages = [sales2021, sales2022];
  const salesDayImage = [sales202112Day, sales202101Day];
  const adImage = [ad2021, ad2022];
  const adDayImage = [ad202112Day, ad202201Day];

  const [salesDateType, setSalesDateType] = useState(false);
  const [adDateType, setAdDateType] = useState(false);

  const [selectedChart, setSelectedChart] = useState(salesImages);
  const [selectedAdChart, setSelectedAdChart] = useState(adImage);

  const [turnSalesCount, setTurnSalesCount] = useState(0);
  const [turnAdCount, setTurnAdCount] = useState(0);

  const salesDateTypeChangeHandler = (e, b) => {
    setSalesDateType(b);

    if (b === true) {
      setSelectedChart(salesDayImage);
      setTurnSalesCount(0);
    } else {
      setSelectedChart(salesImages);
      setTurnSalesCount(0);
    }
  };

  const adDateTypeChangeHandler = (e, b) => {
    setAdDateType(b);

    if (b === true) {
      setSelectedAdChart(adDayImage);
      setTurnAdCount(0);
    } else {
      setSelectedAdChart(adImage);
      setTurnAdCount(0);
    }
  };

  const salesTurnClickHandler = (e, b) => {
    if (b === true) {
      setTurnSalesCount(turnSalesCount + 1);
    } else {
      setTurnSalesCount(turnSalesCount - 1);
    }
  };

  const adTurnClickHandler = (e, b) => {
    if (b === true) {
      setTurnAdCount(turnAdCount + 1);
    } else {
      setTurnAdCount(turnAdCount - 1);
    }
  };

  const SalesDateRender = () => {
    if (salesDateType) {
      // 일별
      switch (turnSalesCount) {
        case 0:
          return <p style={totaltext}>2021년 12월</p>;

        case 1:
          return <p style={totaltext}>2022년 1월</p>;

        default:
          break;
      }
    } else {
      switch (turnSalesCount) {
        case 0:
          return <p style={totaltext}>2021년 1월~12월</p>;

        case 1:
          return <p style={totaltext}>2022년 1월~12월</p>;

        default:
          break;
      }
    }
  };

  const AdDateRender = () => {
    if (adDateType) {
      switch (turnAdCount) {
        case 0:
          return <span style={totaltext}>2021년 12월</span>;
        case 1:
          return <span style={totaltext}>2022년 1월</span>;
        default:
          break;
      }
    } else {
      switch (turnAdCount) {
        case 0:
          return <span style={totaltext}>2021년 1월 ~ 12월</span>;
        case 1:
          return <span style={totaltext}>2022년 1월 ~ 12월</span>;

        default:
          break;
      }
    }
  };

  const TotalPriceRender = () => {
    if (salesDateType) {
      // 일별
      switch (turnSalesCount) {
        case 0:
          return <p style={moneytext}>1,000,000</p>;

        case 1:
          return <p style={moneytext}>1,400,000</p>;

        default:
          break;
      }
    } else {
      switch (turnSalesCount) {
        case 0:
          return <p style={moneytext}>980,000</p>;

        case 1:
          return <p style={moneytext}>1,400,000</p>;

        default:
          break;
      }
    }
  };

  return (
    <>
      <div style={chartbackborder}>
        <div style={chartbox}>
          <div style={chartbox2}>
            <img src={Charticon} style={imgbox} />
            <div style={chartstext}>매출 통계</div>

            <div
              style={{
                display: "flex",
                position: "absolute",
                right: 50,
                marginTop: 7,
              }}
            >
              <button
                onClick={(e) => salesDateTypeChangeHandler(e, true)}
                style={
                  salesDateType
                    ? {
                        fontSize: 13,
                        color: "#9a65ff",
                        backgroundColor: "#f6f2ff",
                        border: "0.5px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                    : {
                        fontSize: 13,
                        color: "#707070",
                        backgroundColor: "white",
                        border: "0.5px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                }
              >
                일간
              </button>

              <button
                onClick={(e) => salesDateTypeChangeHandler(e, false)}
                style={
                  !salesDateType
                    ? {
                        fontSize: 13,
                        color: "#9a65ff",
                        backgroundColor: "#f6f2ff",
                        border: "0.5px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                    : {
                        fontSize: 13,
                        color: "#6b6b6b",
                        backgroundColor: "white",
                        border: "0.5px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                }
              >
                월간
              </button>
            </div>
          </div>
        </div>
        <div style={chartstext3}>
          <div style={{ display: "flex", position: "relative" }}>
            <div style={{ marginLeft: 40, marginRight: 325 }}>
              <SalesDateRender />
              <TotalPriceRender />
            </div>

            <div
              style={{
                display: "flex",
                position: "absolute",
                right: 40,
                marginTop: 15,
              }}
            >
              <div style={{ marginRight: 25, display: "flex" }}>
                <div
                  style={{ width: 13, height: 13, backgroundColor: "#aaebff" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "#121212",
                    fontWeight: "bold",
                  }}
                >
                  총 매출
                </span>
              </div>
              <span
                style={{ fontSize: 13, color: "#b4b4b4", fontWeight: "bold" }}
              >
                단위 : 천원
              </span>
            </div>
          </div>
        </div>
        <div style={{ position: "relative", left: 35, top: 40 }}>
          <button
            onClick={(e) => salesTurnClickHandler(e, false)}
            style={{
              width: 40,
              height: 40,
              fontSize: 24,
              color: "#b4b4b4",
              backgroundColor: "white",
              border: "1px solid #b4b4b4",
            }}
            disabled={!selectedChart[turnSalesCount - 1]}
          >
            &lt;
          </button>
          <img
            style={{ margin: "0 20px" }}
            src={selectedChart[turnSalesCount]}
            alt="sales2021"
          />
          <button
            onClick={(e) => salesTurnClickHandler(e, true)}
            style={{
              width: 40,
              height: 40,
              fontSize: 24,
              color: "#b4b4b4",
              backgroundColor: "white",
              border: "1px solid #b4b4b4",
            }}
            disabled={!selectedChart[turnSalesCount + 1]}
          >
            &gt;
          </button>
        </div>
      </div>

      <div style={chartbackborders}>
        <div style={chartbox}>
          <div style={chartbox2}>
            <img src={TVicon} style={imgbox} />
            <div style={chartstext}> 광고 통계</div>
            <div
              style={{
                display: "flex",
                position: "absolute",
                right: 50,
                marginTop: 7,
              }}
            >
              <button
                onClick={(e) => adDateTypeChangeHandler(e, true)}
                style={
                  adDateType
                    ? {
                        fontSize: 13,
                        color: "#9a65ff",
                        backgroundColor: "#f6f2ff",
                        border: "1px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                    : {
                        fontSize: 13,
                        color: "#6b6b6b",
                        backgroundColor: "white",
                        border: "1px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                }
              >
                일간
              </button>

              <button
                onClick={(e) => adDateTypeChangeHandler(e, false)}
                style={
                  !adDateType
                    ? {
                        fontSize: 13,
                        color: "#9a65ff",
                        backgroundColor: "#f6f2ff",
                        border: "1px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                    : {
                        fontSize: 13,
                        color: "#6b6b6b",
                        backgroundColor: "white",
                        border: "1px solid #707070",
                        width: "88px",
                        height: "28px",
                      }
                }
              >
                월간
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: 30, position: "relative" }}>
          <AdDateRender />
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: 50,
              marginTop: 7,
            }}
          >
            <div style={{ marginRight: 25, display: "flex" }}>
              <div
                style={{ width: 13, height: 13, backgroundColor: "#e4d6ff" }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "#121212",
                  fontWeight: "bold",
                }}
              >
                클릭수
              </span>
            </div>
            <span
              style={{ fontSize: 13, color: "#b4b4b4", fontWeight: "bold" }}
            >
              단위 : 건
            </span>
          </div>
        </div>

        <div style={{ position: "relative", left: 35, top: 70 }}>
          <button
            onClick={(e) => adTurnClickHandler(e, false)}
            style={{
              width: 40,
              height: 40,
              fontSize: 24,
              color: "#b4b4b4",
              backgroundColor: "white",
              border: "1px solid #b4b4b4",
            }}
            disabled={!selectedAdChart[turnAdCount - 1]}
          >
            &lt;
          </button>
          <img
            style={{ margin: "0 20px" }}
            src={selectedAdChart[turnAdCount]}
            alt="sales2021"
          />
          <button
            onClick={(e) => adTurnClickHandler(e, true)}
            style={{
              width: 40,
              height: 40,
              fontSize: 24,
              color: "#b4b4b4",
              backgroundColor: "white",
              border: "1px solid #b4b4b4",
            }}
            disabled={!selectedAdChart[turnAdCount + 1]}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
};
export default Chart;
