import React, { useState } from "react";
import Header from "../../header";
import Managenav from "../../manage_nav";
import Chart from "./chart";
import Statistics from "./statistics";
import { buttontext2, unbuttontext2 } from "./styles";

const AnalysisView = (props) => {
  const [Sales, setSales] = useState(
    props.location.state && props.location.state.render ? false : true
  );

  const Click = () => {
    setSales(!Sales);
  };

  return (
    <>
      <Header mode="operation"></Header>
      <Managenav mode="operation" menu="통계분석" sub="통계분석"></Managenav>
      <section className="content make_ai">
        <h1 className="title">통계분석</h1>
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <span style={Sales ? buttontext2 : unbuttontext2} onClick={Click}>
            매출/광고 통계
          </span>
          <span style={Sales ? unbuttontext2 : buttontext2} onClick={Click}>
            동영상/상품 통계
          </span>
        </div>
        {Sales ? <Chart></Chart> : <Statistics></Statistics>}
      </section>
    </>
  );
};
export default AnalysisView;
