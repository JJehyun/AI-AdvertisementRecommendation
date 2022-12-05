import React from "react";

const LoginAlertModal = ({ modal, closeModal }) => {

  return (
    <div className="openModal modal">
      <section className="loginAlertModal">
        <main>
          <div className="login_alert_modal">
            <div className="content">
              {modal.content}
              <button type="button" onClick={closeModal}>
                닫기
              </button>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};
export default LoginAlertModal;
