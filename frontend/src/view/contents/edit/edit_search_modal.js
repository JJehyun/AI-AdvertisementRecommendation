import React, { useState } from "react";

const EditSearchModal = (props) => {
  const { close, header, type, subTitle } = props;

  const subTitleStyle = {
    position: 'relative',
    fontSize: '13px',
    color: '#a5a5a5',
    left: '7px',
    textAlign: 'left',
  }

  return (
    <div className="openModal modal">
      <section
        className={
          type == "directly_upload"
            ? "searchModal directly_upload_modal"
            : "searchModal"
        }
      >
        <main>
          <header>
            <h1>{header}
              {subTitle && <span style={subTitleStyle}>{subTitle}</span>}
            </h1>

            <button className="close" onClick={close}>
              {" "}
              &times;{" "}
            </button>
          </header>
          {props.children}
        </main>
        {/* <footer>
                    <button className="close" onClick={close}> close </button>
                </footer> */}
      </section>
    </div>
  );
};
export default EditSearchModal;
