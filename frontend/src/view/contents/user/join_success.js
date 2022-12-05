import React from "react";
import Header from "../../header.js";
import { Link } from "react-router-dom";

import join_level_2 from "../../images/common/join_level2.PNG";
import Footer from "../../components/footer.js";

const JoinSuccess = (props) => {
  const { user_name, id } = props.location.state;
  return (
    <>
      <Header mode="login"></Header>
      <div className="Find_module">
        <div className="title">
          <h1>회원가입 완료</h1>
          <p>
            <img src={join_level_2} />
          </p>
        </div>

        <div className="Success_module">
          <p className="title">환영합니다!</p>
          <p>
            {user_name}님, 회원가입을 축하드립니다.
            <br />
            Boshow 통합관리 시스템에 가입하신 ID는 <span>{id}</span> 입니다.
          </p>
        </div>
        <Link to="/login" className="join_btn">
          로그인하기
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default JoinSuccess;
