import React, { useState, useEffect } from "react";
import no_img from "../images/common/no_item.png";
import closeImage from "../images/Adbimage/ic_close.png";
import shareImage from "../images/Adbimage/ic_share.png";
import presentImage from "../images/Adbimage/ic_present.png";

const AdbTypeC = (props) => {
  const { selected_adb, selected_adb_b } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCtypeRender, setIsCtypeRender] = useState(true);

  const onClickCloseHandler = () => {
    setIsCtypeRender(false);
  };

  return (
    <>
      {isCtypeRender && (
        <div
          className={
            sidebarOpen ? "C_type_advertise sidebarOpen" : "C_type_advertise"
          }
        >
          {/* <header style={{ position: "absolute", top: 0, right: 17 }}>
          <span>X</span>
        </header> */}

          <span onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="C_type_side_mini"></span>
          </span>

          <div style={{ paddingTop: 20 }}>
            <div>
              <header style={{ position: "absolute", top: 3, right: 15 }}>
                <button
                  style={{ width: 25, background: "none", border: "none" }}
                >
                  <img
                    src={presentImage}
                    alt="presentImage"
                    style={{ width: 25 }}
                  />
                </button>
                <button
                  style={{ width: 25, background: "none", border: "none" }}
                >
                  <img
                    src={shareImage}
                    alt="shareImage"
                    style={{ width: 25 }}
                  />
                </button>
                <button
                  onClick={onClickCloseHandler}
                  style={{ width: 25, background: "none", border: "none" }}
                >
                  <img
                    src={closeImage}
                    alt="closeImage"
                    style={{ width: 25 }}
                  />
                </button>
              </header>

              <span
                style={{
                  position: "absolute",
                  right: 17,
                  top: 35,
                  padding: "2px 4px",
                  borderRadius: "5px",
                  fontSize: 10,
                  fontWeight: "lighter",
                  color: "white",
                  border: "1px solid #b4b4b4",
                }}
              >
                AD
              </span>
              {selected_adb && selected_adb.idx ? (
                <img
                  style={{ height: 245, width: "100%", margin: "0 0 10%" }}
                  src={
                    "//222.108.186.236:8000/static/advertise_images/" +
                    selected_adb.idx +
                    ".jpg"
                  }
                  alt={`${selected_adb.idx}번 광고`}
                />
              ) : (
                <img src={no_img} alt="Noimage" />
              )}
            </div>

            <ul className="C_type_btn">
              <li>
                <button
                  type="button"
                  style={{
                    backgroundColor: "rgb(76, 76, 76)",
                    border: "1px solid #b4b4b4",
                  }}
                >
                  <a href={selected_adb.url}>자세히 보기</a>
                </button>
              </li>
            </ul>

            {selected_adb_b.idx && (
              <div className="B_type_add">
                <a href={selected_adb_b.url}>
                  <img
                    src={
                      "//222.108.186.236:8000/static/advertise_images/" +
                      selected_adb_b.idx +
                      ".jpg"
                    }
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdbTypeC;
