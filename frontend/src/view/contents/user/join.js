import React, { useState } from "react";
import Header from "../../header.js";
import join_level from "../../images/common/join_level.PNG";
import { useDispatch } from "react-redux";
import { certificateAuth, join } from "../../actions/authentication";
import Footer from "../../components/footer.js";
import LoginAlertModal from "./loginAlertModal.js";

const Join = (props) => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    id: "",
    pw: "",
    re_pw: "",
    email: "",
    domain: "",
    user_name: "",
    company: "",
    dept: "",
    phone_number: "",
  });
  const [message, setMessage] = useState({
    id_msg: null,
    pw_msg: null,
    re_pw_msg: null,
    email_msg: null,
    user_name_msg: null,
    company_msg: null,
  });
  const [match, setMatch] = useState({
    id: false,
    pw: false,
    re_pw: false,
    email: false,
    domain: false,
    user_name: false,
    company: false,
  });
  const [modal, setModal] = useState({ status: false, content: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const changeDomain = (e) => {
    const value = e.target.value;
    const domain = document.getElementById("domain");

    if (value === "") {
      domain.readOnly = false;
    } else {
      domain.readOnly = true;
      setMessage({ ...message, email_msg: null });
      setMatch({ ...match, domain: true });
    }

    setValues({ ...values, domain: e.target.value });
  };

  const checkId = (e) => {
    dispatch(certificateAuth({ user_id: values.id, mode: "id" })).then(
      (res) => {
        // 중복 확인 후 처리
        console.log(res);
        if (res.result) {
          setModal({
            status: true,
            content: <p>이미 존재하는 아이디입니다.</p>,
          });

          setMessage({
            ...message,
            id_msg: <p className="no_message">이미 존재하는 아이디입니다.</p>,
          });
          return setMatch({ ...match, id: false });
        }

        setMessage({
          ...message,
          id_msg: <p className="ok_message">사용 가능한 아이디입니다.</p>,
        });
        setMatch({ ...match, id: true });
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const key in match) {
      if (!match[key]) {
        return;
      }
    }

    const data = {
      user_id: values.id,
      user_email: values.email + "@" + values.domain,
      user_pw: values.pw,
      user_name: values.user_name,
      company: values.company,
      dept: values.dept,
      phone_number: values.phone_number,
    };

    dispatch(join(data)).then((res) => {
      if (!res) {
        return setModal({
          status: true,
          content: <p>등록된 회사가 아닙니다.</p>,
        });
      }

      props.history.push({
        pathname: "/join_success",
        state: {
          user_name: values.user_name,
          id: values.id,
        },
      });
    });
  };

  const handleCheckValue = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "id":
        if (!/^[a-zA-Z0-9]{5,}$/.test(value)) {
          setMessage({
            ...message,
            id_msg: (
              <p className="no_message">
                아이디는 띄어쓰기 없이 최소 5글자 이상의 영문/숫자를 조합하여
                입력하셔야 합니다.
              </p>
            ),
          });
          setMatch({ ...match, id: false });
        } else {
          if (match["id"] === false) {
            setMessage({
              ...message,
              id_msg: <p className="no_message">중복 확인을 진행해주세요.</p>,
            });
          }
        }
        break;
      case "pw":
        if (
          /^(?=.*[A-Za-z])(?=.*[\d])[A-Za-z\d@$!%*#?&]{8,}$|(?=.*[\d])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$|(?=.*[A-Za-z])(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value
          )
        ) {
          setMessage({
            ...message,
            pw_msg: <p className="ok_message">사용가능한 비밀번호입니다.</p>,
          });
          setMatch({ ...match, pw: true });
        } else {
          setMessage({
            ...message,
            pw_msg: (
              <p className="no_message">
                비밀번호는 띄어쓰기 없이 최소 8글자 이상의 영문/숫자/특수문자를
                <br />
                2개 이상 조합하여 입력하셔야 합니다.
              </p>
            ),
          });
          setMatch({ ...match, pw: false });
        }
        break;
      case "re_pw":
        if (values.pw === value && value.length > 0) {
          setMessage({
            ...message,
            re_pw_msg: <p className="ok_message">비밀번호가 일치합니다.</p>,
          });
          setMatch({ ...match, re_pw: true });
        } else if(values.pw !== value && value.length > 0){
          setMessage({
            ...message,
            re_pw_msg: (
              <p className="no_message">비밀번호가 일치하지 않습니다.</p>
            ),
          });
          setMatch({ ...match, re_pw: false });
        } else {
          setMessage({
            ...message,
            re_pw_msg: (
              <p className="none_message"></p>
            ),
          });
        }
        break;
      case "email":
        if (value !== "") {
          setMatch({ ...match, email: true });
        } else {
          setMessage({
            ...message,
            email_msg: (
              <p className="no_message">이메일 형식이 올바르지 않습니다.</p>
            ),
          });
          setMatch({ ...match, email: false });
        }
        break;
      case "domain":
        if (value !== "") {
          setMessage({ ...message, email_msg: null });
          setMatch({ ...match, domain: true });
        } else {
          setMessage({
            ...message,
            email_msg: (
              <p className="no_message">이메일 형식이 올바르지 않습니다.</p>
            ),
          });
          setMatch({ ...match, domain: false });
        }
        break;
      case "user_name":
        if (value !== "") {
          setMessage({ ...message, user_name_msg: null });
          setMatch({ ...match, user_name: true });
        } else {
          setMessage({
            ...message,
            user_name_msg: (
              <p className="no_message">이름이 입력되지 않았습니다.</p>
            ),
          });
          setMatch({ ...match, user_name: false });
        }
        break;
      case "company":
        if (value !== "") {
          setMessage({ ...message, company_msg: null });
          setMatch({ ...match, company: true });
        } else {
          setMessage({
            ...message,
            company_msg: (
              <p className="no_message">회사명 입력되지 않았습니다.</p>
            ),
          });
          setMatch({ ...match, company: false });
        }
        break;
    }
  };

  const closeModal = () => {
    setModal({ ...modal, status: false });
  };

  return (
    <>
      <Header mode="login"></Header>

      <div className="title">
        <h1>회원정보 입력</h1>
        <p>
          <img src={join_level} />
        </p>
      </div>

      <section className="join_module">
        <form onSubmit={handleSubmit}>
          <h1>회원정보</h1>

          <div className="form-group join_id">
            <label>
              아이디 <span>*</span>
            </label>
            <input
              type="text"
              name="id"
              value={values.id}
              className="join_id_value"
              placeholder="최소 5글자 이상의 영문/숫자를 조합하여 입력해주세요"
              onChange={handleChange}
              onBlur={handleCheckValue}
              required
            />
            <input
              type="button"
              className="join_id_auth"
              value="중복확인"
              onClick={checkId}
            />
            {message.id_msg}
          </div>
          <div className="form-group">
            <label>
              비밀번호 <span>*</span>
            </label>
            <input
              type="password"
              name="pw"
              value={values.pw}
              placeholder="최소 8글자 이상의 영문/숫자/특수문자 2개 이상 조합하여 입력해주세요"
              onChange={handleChange}
              onBlur={handleCheckValue}
              required
            />
            {message.pw_msg}
          </div>
          <div className="form-group">
            <label>
              비밀번호 확인 <span>*</span>
            </label>
            <input
              type="password"
              name="re_pw"
              value={values.re_pw}
              onChange={handleChange}
              onBlur={handleCheckValue}
              required
            />
            {message.re_pw_msg}
          </div>
          <div className="form-group join_email">
            <label>
              이메일 <span>*</span>
            </label>
            <input
              type="text"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleCheckValue}
              required
            />
            @
            <input
              type="text"
              id="domain"
              name="domain"
              value={values.domain}
              onChange={handleChange}
              onBlur={handleCheckValue}
              required
            />
            <select name="domain_option" onChange={changeDomain}>
              <option value="" selected>
                직접입력
              </option>
              <option value="naver.com">naver.com</option>
              <option value="daum.net">daum.net</option>
              <option value="hanmail.net">hanmail.net</option>
              <option value="nate.com">nate.com</option>
              <option value="gmail.com">gmail.com</option>
            </select>
            {message.email_msg}
          </div>
          <div className="form-group">
            <label>
              이름 <span>*</span>
            </label>
            <input
              type="text"
              name="user_name"
              value={values.user_name}
              placeholder="이름을 입력해주세요"
              onChange={handleChange}
              onBlur={handleCheckValue}
              required
            />
            {message.user_name_msg}
          </div>
          <div className="form-group">
            <label>
              회사명 <span>*</span>
            </label>
            <input
              type="text"
              name="company"
              value={values.company}
              placeholder="회사명을 입력해주세요"
              onChange={handleChange}
              onBlur={handleCheckValue}
              required
            />
            {message.company_msg}
          </div>
          <div className="form-group">
            <label>
              부서<span></span>
            </label>
            <input
              type="text"
              name="dept"
              value={values.dept}
              onChange={handleChange}
            />
          </div>
          <div className="form-group phone_number">
            <label>휴대전화</label>
            <input
              type="text"
              name="phone_number"
              value={values.phone_number}
              placeholder="-를 제외한 번호를 입력해주세요"
              onChange={handleChange}
            />
          </div>
          {/* <div className="join_check">
                        <div>
                            <input type="checkbox" id="join_all_check" />
                            <label htmlFor="join_all_check"><span className="join_all_check">모든 약관에 동의</span></label>
                        </div>
                        <div>
                            <input type="checkbox" id="join_check_1" />
                            <label htmlFor="join_check_1"><span>[필수] 개인정보 수집 및 동의</span></label>
                            <span>자세히 보기</span>
                        </div>
                        <div>
                            <input type="checkbox" id="join_check_2" />
                            <label htmlFor="join_check_2"><span>[필수] 개인정보 취급 위탁 동의</span></label>
                            <span>자세히 보기</span>
                        </div>
                        <div>
                            <input type="checkbox" id="join_check_3" />
                            <label htmlFor="join_check_3"><span>[필수] 서비스 이용약관</span></label>
                            <span>자세히 보기</span>
                        </div>
                        <div>
                            <input type="checkbox" id="join_check_4" />
                            <label htmlFor="join_check_4"><span>[선택] 마케팅 수신 동의</span></label>
                            <span>자세히 보기</span>
                        </div>
                    </div> */}

          <input type="submit" className="join_btn" value="가입하기" />
        </form>
      </section>

      <Footer />

      {modal.status && (
        <LoginAlertModal modal={modal} closeModal={closeModal} />
      )}
    </>
  );
};

export default Join;
