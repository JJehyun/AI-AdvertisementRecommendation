import React, { useState, useEffect } from "react";

import { CupertinoPane, CupertinoSettings } from "cupertino-pane";
import { Swiper, SwiperSlide } from "swiper/react";
import no_img from "../images/common/no_item.png";

const AdbTypeD = (props) => {
  const { selected_adb } = props;
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videoHeight, setVideoHeight] = useState(0);
  const [videoWidth, setVideoWidth] = useState(0);
  // const [listWidth, setListWidth] = useState(0);
  // const [listMargin, setListMargin] = useState(0);
  useEffect(() => {
    CupertinoPaneSet();
  }, [videoHeight]);

  // const onSetSidebarOpen = () =>{
  //     setSidebarOpen(!sidebarOpen);
  // }

  const myPane = new CupertinoPane(".cupertino-pane", {
    parentElement: ".video_preview_section",
    fitHeight: true,
    initialBreak: {
      top: {
        // Topper point that pane can reach
        enabled: true, // Enable or disable breakpoint
        height: (videoHeight / 100) * 5, // Pane breakpoint height
        bounce: true, // Bounce pane on transition
      },
      middle: {
        enabled: true,
        height: (videoHeight / 100) * 10,
        bounce: true,
      },
      bottom: {
        enabled: true,
        height: (videoHeight / 100) * 25,
      },
    },
  });

  myPane.present({ animate: true }).then((res) => {});

  const CupertinoPaneSet = () => {
    //     if(document.querySelector('ifame') || document.querySelector('video')){
    //         var video = null
    //         video = document.querySelector('.video_preview_section')
    //         // if(document.querySelector('ifame')){
    //         //     video = document.querySelector('ifame')
    //         // }else if(document.querySelector('video')){
    //         //     video = document.querySelector('video')
    //         // }
    //         var videoHeight = 0;
    //         var videoWidth = 0;
    //         var x = video.width;
    //         var y = video.height;
    //         if(y > x){
    //             videoWidth = y;
    //             videoHeight = x;
    //         }else{
    //             videoWidth = x;
    //             videoHeight = y;
    //         }
    //         let listWidth = ((videoWidth - ((videoWidth/100) * 6)) / 6)
    //         let listMargin = (((videoWidth)/100) * 2.3)
    //         setVideoHeight(videoHeight);
    //         setVideoWidth(videoWidth);
    //         setListWidth(listWidth);
    //         setListMargin(listMargin);
    //     }
  };

  const d_list = (
    <SwiperSlide style={{ width: "150px", height: "100px" }}>
      <a href={selected_adb.url}>
        {" "}
        <img
          src={
            `http:${process.env.REACT_APP_BACKEND_HOST}static/advertise_images/` +
            String(selected_adb.idx) +
            ".jpg"
          }
          className="advertise_img_type_d"
          style={{ width: "100%", height: "100px" }}
        ></img>
      </a>
    </SwiperSlide>
  );

  return (
    <>
      <div className="D_type_advertise">
        <div className="cupertino-pane">
          <Swiper
            className="mySwiper"
            spaceBetween={8}
            slidesPerView={7}
            freeMode={true}
          >
            <SwiperSlide
              style={{
                width: "150px",
                height: "100px",
                backgroundColor: "#b4b4b4",
              }}
            >
              <a></a>
            </SwiperSlide>

            <SwiperSlide
              style={{
                width: "150px",
                height: "100px",
                backgroundColor: "#b4b4b4",
              }}
            >
              <a></a>
            </SwiperSlide>

            <SwiperSlide
              style={{
                width: "150px",
                height: "100px",
                backgroundColor: "#b4b4b4",
              }}
            >
              <a></a>
            </SwiperSlide>

            <SwiperSlide
              style={{
                width: "150px",
                height: "100px",
                backgroundColor: "#b4b4b4",
              }}
            >
              <a></a>
            </SwiperSlide>

            <SwiperSlide
              style={{
                width: "150px",
                height: "100px",
                backgroundColor: "#b4b4b4",
              }}
            >
              <a></a>
            </SwiperSlide>

            {d_list}

            <SwiperSlide
              style={{
                width: "150px",
                height: "100px",
                backgroundColor: "#b4b4b4",
              }}
            >
              <a></a>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default AdbTypeD;
