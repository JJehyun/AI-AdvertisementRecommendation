import React from "react";

import Boshow_img from "../images/common/Boshow.png";

const Footer = () => {
  return (
    <div className="footer">
      <img src={Boshow_img} />
      <p>
        <a href="">개인정보 처리 방침</a>
      </p>
      <p>
        <strong>PNWAT</strong>
      </p>
      <p>서울시 금천구 가산디지털1로 83, 파트너스타워1차 306호</p>
      <p>
        <span>TEL : 02-3775-4015</span>
        <span>FAX : 02-3775-4014</span>
        <span>E-mail : pnwat@pnwat.com</span>
      </p>
      <p>Copyright PNWAT Co., Ltd.All rights reserved.</p>
    </div>
  );
};

export default Footer;
