import React from "react";

const AlertModal = ({ message, setMessage }) => {
  // .(닷) 기준으로 줄바꿈
  const messageSpacing = message?.split(".");

  return message && (
    <div className="modal">
      <section className="background">
          <div className="alert_modal">
            <div className="content">
              {messageSpacing?.map((msg, key) => (
                <>
                  {msg}
                  {messageSpacing?.length - 1 !== key && <>.<br/></>}
                </>
              ))}
              <button type="button" onClick={() => setMessage(null)}>
                확인
              </button>
            </div>
          </div>
      </section>
    </div>
  );
};
export default AlertModal;
