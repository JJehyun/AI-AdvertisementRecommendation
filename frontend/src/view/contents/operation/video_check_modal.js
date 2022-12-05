import React, { Component, useRef } from "react";

class VideoCheckModal extends Component {
  render() {
    const { open, close, header } = this.props;

    return (
      <div className={open ? "openModal modal" : "modal"}>
        {open ? (
          <section>
            <main>{this.props.children}</main>
          </section>
        ) : null}
      </div>
    );
  }
}
export default VideoCheckModal;
