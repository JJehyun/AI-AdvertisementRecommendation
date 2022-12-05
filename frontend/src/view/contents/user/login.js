import React, { useState, useEffect } from "react";
import Header from "../../header.js";
import Footer from "../../components/footer.js";
import { Link } from "react-router-dom";
import LoginAlertModal from "./loginAlertModal.js";
import { useDispatch } from "react-redux";
import { login } from "../../actions/authentication";

const Login = (props) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    company: "",
    user_id: "",
    user_pw: "",
  });
  const [modal, setModal] = useState({ status: false, content: null });
  const [saveAccountInfo, setSaveAccountInfo] = useState(false);

  // 회사명, 아이디 쿠키에 저장 및 사용
  useEffect(() => {
    setValues({
      ...values,
      company: localStorage.getItem("company") || "",
      user_id: localStorage.getItem("user_id") || "",
    });
    if (
      localStorage.getItem("company") !== undefined ||
      localStorage.getItem("user_id") !== undefined
    ) {
      setSaveAccountInfo(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  // 로그인
  const handleSubmit = (e) => {
    e.preventDefault();

    // 로그인 api (틀릴 시 팝업)
    // dispatch(login(values)).then((res) => {
    //   if (!res) {
    //     return setModal({
    //       status: true,
    //       content: (
    //         <p>
    //           회사명, 아이디, 비밀번호를 다시 확인해주세요.
    //           <br />
    //           아이디는 최소 5글자 이상, 비밀번호는
    //           <br />
    //           영문,숫자,특수문자를 포함하여
    //           <br />
    //           최소 8자 이상입니다.
    //         </p>
    //       ),
    //     });
    //   }

    // 저장 체크 시 쿠키에 저장
    if (saveAccountInfo) {
      localStorage.setItem("company", "코리아");
      localStorage.setItem("user_id", "누구요");
    } else {
      localStorage.removeItem("company");
      localStorage.removeItem("user_id");
    }

    props.history.push("/video_add");
    // });
  };

  const closeModal = () => {
    setModal({ ...modal, status: false });
  };

  return (
    <>
      <Header mode="login"></Header>
      <div className="title">
        <h1>관리자 로그인</h1>
        <p>안녕하세요! Boshow 통합관리 시스템에 오신 걸 환영합니다:)</p>
      </div>

      <section className="login_module">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="company"
              value={values.company}
              type="text"
              placeholder="회사명"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              name="user_id"
              value={values.user_id}
              type="text"
              placeholder="아이디"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              name="user_pw"
              type="password"
              placeholder="비밀번호"
              onChange={handleChange}
            />
          </div>

          <div className="login_bottom">
            <div>
              <span className="id_save_check">
                <input
                  id="id_save_check"
                  type="checkbox"
                  checked={saveAccountInfo}
                  onClick={() => setSaveAccountInfo(!saveAccountInfo)}
                />
                <label htmlFor="id_save_check">
                  <span>저장 [회사명, 아이디]</span>
                </label>
              </span>
              <Link to="/join">회원가입</Link>
            </div>
            <input type="submit" className="login_submit" value="로그인" />
            <div className="search_person_info">
              <span>
                <Link to="/id_inquiry">아이디 찾기</Link>
              </span>
              &nbsp;|&nbsp;
              <span>
                <Link to="/pw_inquiry">비밀번호 찾기</Link>
              </span>
            </div>
          </div>
        </form>
      </section>

      <Footer />

      {/*로그인 성공, 실패 메시지 팝업*/}
      {modal.status && (
        <LoginAlertModal modal={modal} closeModal={closeModal} />
      )}
    </>
  );
};

export default Login;
