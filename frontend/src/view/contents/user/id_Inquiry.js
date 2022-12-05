import React, { useState } from "react";
import Header from "../../header.js";
import Footer from "../../components/footer.js";
import LoginAlertModal from "./loginAlertModal.js";
import { useDispatch } from "react-redux";
import {
  certificateAuth,
  emailCertification,
} from "../../actions/authentication";

const IdInquiry = (props) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState({ status: false, content: null });

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 아이디 찾기 api (틀릴 시 팝업)
    dispatch(certificateAuth({ email: email, mode: "email" })).then((res) => {
      if (!res.result) {
        return setModal({
          status: true,
          content: (
            <p>
              회원정보에 등록된 이메일이 없습니다.
              <br />
              확인 후 다시 시도해주세요.
            </p>
          ),
        });
      }
      setModal({
        status: true,
        content: (
          <p>
            이메일을 발송 중입니다. <br />
            서버 상태에 따라 1분 정도 시간이 걸릴 수 있습니다.
          </p>
        ),
      });
      dispatch(emailCertification({ email: email, mode: "id" })).then((res) => {
        // alert('이메일 전송을 성공했습니다.')
      });
    });
  };

  const closeModal = () => {
    setModal({ ...modal, status: false });
  };

  return (
    <>
      <Header mode="login"></Header>
      <div className="Find_module">
        <p className="title">아이디 찾기</p>
        <p className="highlight">
          이메일 인증을 통해 아이디를 찾을 수 있습니다.
        </p>
        <p className="find_info">
          본인인증 시 제공되는 정보는 해당 인증기관에서 직접 수집하며, 인증
          이외의 용도로 이용 또는 저장하지 않습니다.
        </p>

        <div className="auth_way_select">
          <span className="auth_box">
            <form onSubmit={handleSubmit}>
              <p className="title">이메일 인증</p>
              <p>
                회원정보에 등록한 이메일과 입력한 이메일이 <br /> 같아야 정보를
                받을 수 있습니다.
              </p>
              <input
                name="email"
                type="email"
                placeholder="ex) email@email.com"
                value={email}
                onChange={handleChange}
                required
              />
              <input type="submit" value="확인" />
            </form>
          </span>
        </div>
      </div>

      <Footer />

      {modal.status && (
        <LoginAlertModal modal={modal} closeModal={closeModal} />
      )}
    </>
  );
};

export default IdInquiry;
