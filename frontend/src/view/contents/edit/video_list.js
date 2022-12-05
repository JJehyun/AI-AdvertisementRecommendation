import React, { Component } from "react";
import Header from "../../header.js";
import ManageNav from "../../manage_nav.js";
import VideoContainer from "../../components/video_container.js";

class VideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const titleStyle = {
      position: 'relative',
      height: '41px',
      margin: '0 0 24px 0',
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '-0.34px',
      textAlign: 'left',
      color: '#121212',
      maxWidth: '1280px'
    }

    return (
      <>
        <Header mode="editing" />
        <ManageNav
          mode="editing"
          menu="동영상"
          sub_menu="동영상 관리"
        />
        <section className="content">
          <div style={{ display:'flex' }}>
            <h1 className="title" style={ titleStyle }>동영상 관리
            </h1>
          </div>
          <VideoContainer type="list" />
        </section>
      </>
    );
  }
}

export default VideoList;
