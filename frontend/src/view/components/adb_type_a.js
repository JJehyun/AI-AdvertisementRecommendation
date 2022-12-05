import React, { useState } from "react";

import adb_A_type_sample from "../images/common/add_A_type_sample.png";

const AdbTypeA = (props) => {
  const { adb_idx, adb_url, isOpenCtype } = props;
  const [renderAtype, setRenderAtype] = useState(true);

  const handleClose = () => {
    setRenderAtype(false);
  };

  return (
    <>
      {renderAtype && (
        <div
          className={
            isOpenCtype
              ? "advertise_type_a advertise_type_a_open"
              : "advertise_type_a"
          }
        >
          <button type="button" onClick={handleClose}>
            x
          </button>
          <a href={adb_url}>
            <img
              alt="aTypeAd"
              src={
                `${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/` +
                adb_idx +
                ".jpg"
              }
            />
          </a>
        </div>
      )}
    </>
  );
};

export default AdbTypeA;
