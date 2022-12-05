import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Header from "../../header.js";
import Footer from "../../components/footer.js";
import LoginAlertModal from "./loginAlertModal.js";
import {
  certificateAuth,
  emailCertification,
} from "../../actions/authentication";

const PwInquiry = (props) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    user_name: "",
    user_id: "",
    user_email: "",
  });
  const [modal, setModal] = useState({ status: false, content: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let param = {
      name: values.user_name,
      id: values.user_id,
      email: values.user_email,
      mode: "pw",
    };

    // 비밀번호 찾기 api
    dispatch(certificateAuth(param)).then((res) => {
      if (!res.result) {
        let type = "";
        switch (res.type) {
          case "name":
            type = "이름이";
            break;
          case "id":
            type = "아이디가";
            break;
          case "email":
            type = "이메일이";
            break;
        }

        return setModal({
          status: true,
          content: (
            <p>
              회원정보에 등록된 {type} 없습니다.
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
            서버 상태에 따라 1분 정도 시간이 걸릴 수 있습니다. <br />
            이메일 발송이 완료되면 비밀번호 변경 페이지로 이동됩니다.
          </p>
        ),
      });

      dispatch(emailCertification(param)).then((res) => {
        props.history.push({
          pathname: "/pw_inquiry_success",
          state: {
            emailAdress: values.user_email,
          },
        });
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
        <p className="title">비밀번호 찾기</p>
        <p className="highlight">
          이메일 인증을 통해 비밀번호를 찾을 수 있습니다.
        </p>
        <p className="find_info">
          본인인증 시 제공되는 정보는 해당 인증기관에서 직접 수집하며, 인증
          이외의 용도로 이용 또는 저장하지 않습니다.
        </p>

        <div className="auth_way_select">
          <span className="auth_box auth_box_pw">
            <form onSubmit={handleSubmit}>
              <p className="title">임시 비밀번호 발급</p>
              <input
                name="user_name"
                type="text"
                placeholder="이름을 입력해주세요."
                value={values.user_name}
                onChange={handleChange}
                required
              />
              <input
                name="user_id"
                type="text"
                placeholder="아이디를 입력해주세요."
                value={values.user_id}
                onChange={handleChange}
                required
              />
              <input
                name="user_email"
                type="email"
                placeholder="이메일을 입력해주세요."
                value={values.user_email}
                onChange={handleChange}
                required
              />
              <input type="submit" value="이메일로 보내기" />
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

export default PwInquiry;
