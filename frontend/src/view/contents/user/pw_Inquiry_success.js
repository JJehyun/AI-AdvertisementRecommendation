import React from "react";
import Header from "../../header.js";
import Footer from "../../components/footer.js";
import { Link } from "react-router-dom";
import email from "../../images/common/email.PNG";

const PwInquirySuccess = (props) => {
  const { emailAdress } = props.location.state;

  return (
    <>
      <Header mode="login"></Header>
      <div className="Find_module">
        <div className="title">
          <h1>비밀번호 찾기</h1>
          <img src={email} className="email_img" />
        </div>

        <div className="email_auth_module">
          <p className="title">
            이메일로 임시비밀번호를 보냈습니다.
            <br />
            확인 후 새 비밀번호로 변경하세요.
          </p>
          <p>
            입력하신 {emailAdress}으로 임시 비밀번호가 발송됩니다.
            <br />
            전송량이 많은 경우 이메일 전송이 지연될 수 있습니다.
          </p>
        </div>
        <Link to="/change_pw" className="join_btn find_pw_email_btn">
          비밀번호 변경
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default PwInquirySuccess;
