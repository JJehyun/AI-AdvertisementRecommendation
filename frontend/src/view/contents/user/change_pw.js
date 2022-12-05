import React, { useState } from "react";
import Header from "../../header.js";
import LoginAlertModal from "./loginAlertModal.js";
import Footer from "../../components/footer.js";
import { useDispatch } from "react-redux";
import { modifyPw } from "../../actions/authentication";

const ChangePw = (props) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    temp_pw: "",
    new_pw: "",
    re_new_pw: "",
  });
  const [modal, setModal] = useState({ status: false, content: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (values.new_pw != values.re_new_pw) {
      setModal({
        status: true,
        content: <p>비밀번호 확인이 맞지 않습니다.</p>,
      });
      return false;
    }

    let param = { temp_pw: values.temp_pw, new_pw: values.new_pw };
    dispatch(modifyPw(param)).then((res) => {
      // setModal({
      //     status: true,
      //     content:
      //         <p>비밀번호 변경 성공</p>
      // });
      alert("비밀번호 변경 성공");
      props.history.push("/login");
    });
  };

  const closeModal = () => {
    setModal({ ...modal, status: false });
  };

  return (
    <>
      <Header mode="login"></Header>
      <div className="title">
        <h1>비밀번호 변경</h1>
        <p className="change_pw_star">****</p>
        <p className="change_pw_info">
          개인정보 보호를 위해
          <br />새 비밀번호로 변경해주세요.
        </p>
      </div>

      <section className="login_module change_pw_module">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="temp_pw"
              type="password"
              placeholder="임시 비밀번호를 입력해주세요"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="new_pw"
              type="password"
              placeholder="새 비밀번호를 입력해주세요"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="re_new_pw"
              type="password"
              placeholder="새 비밀번호를 한 번 더 입력해주세요"
              onChange={handleChange}
              required
            />
          </div>

          <div className="login_bottom">
            <input type="submit" className="login_submit" value="확인" />
          </div>
        </form>
      </section>

      {modal.status && (
        <LoginAlertModal modal={modal} closeModal={closeModal} />
      )}

      <Footer />
    </>
  );
};

export default ChangePw;
