import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import axios from "axios";

const VideoPlayer = (props) => {
  const { video, itemDetail, _videoWidth } = props;
  const [currentItemDetail, setCurrentItemDetail] = useState([]);
  const [currentTime, setCurrentTime] = useState(-100);
  const [itemRect, setItemRect] = useState([]);
  const [videoWidth, setVideoWidth] = useState(450);
  const [videoUrl, setVideoUrl] = useState("");
  const interval = useRef();
  const videoRef = useRef();

  const video_path = `${process.env.REACT_APP_BACKEND_HOST}static/videos/`;
  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
  const make_image_path = image_path + "make_image/";

  const opts = {
    playerVars: {
      autoplay: 0,
    },
  };

  useEffect(() => {
    if (_videoWidth !== undefined) {
      setVideoWidth(_videoWidth);
    }

    if (video.platform === "SBS") {
      let SBS_video_id = video.url.split("?")[0];
      SBS_video_id = SBS_video_id.split("/");
      SBS_video_id = SBS_video_id[SBS_video_id.length - 1];

      axios
        .get("/MakeSbsToken", null, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          const token = response.data.token;

          axios
            .get(
              "http://apis.sbs.co.kr/play-api/ad-admin/1.0/boshow/media/" +
                SBS_video_id +
                "?pnw-token=" +
                token,
              {
                headers: { "content-type": "application/json" },
              }
            )
            .then((response) => {
              setVideoUrl(response.data.mediaurl);
            });
        });
    } else if (video.platform === "직접 업로드") {
      setVideoUrl(video_path + video.idx + "." + video.url);
    }
  }, []);

  useEffect(() => {
    if (video.platform !== "YOUTUBE") {
      interval.current = setInterval(() => {
        try {
          const time = videoRef.current.currentTime;
          setCurrentTime(time);
        } catch (e) {}
      }, 28);

      return () => {
        return clearInterval(interval.current);
      };
    }
  }, [videoRef]);

  const onReady = (e) => {
    interval.current = setInterval(() => {
      if (e.target.h === null) {
        return clearInterval(interval.current);
      }
      setCurrentTime(e.target.playerInfo.currentTime);
    }, 28);
  };

  const changeItemDetail = () => {
    let current_item_detail = {};
    let prevTime = currentTime - 0.0166666666666666666666665;
    let futureTime = currentTime + 0.0166666666666666666666665;

    current_item_detail = itemDetail.filter((data) => {
      return data.position_time >= prevTime && data.position_time <= futureTime && data.fk_item_idx != null;
    });

    setCurrentItemDetail(current_item_detail);
  };

  useEffect(() => {
    changeItemDetail();
  }, [currentTime]);

  useEffect(() => {
    let item_rect = [];

    currentItemDetail.map(async (data) => {
      await item_rect.push(drawItem(data));
    });

    setItemRect(item_rect);
  }, [currentItemDetail]);

  const drawItem = (data) => {
    const video_el = document.getElementById("video");

    return {
      position: "absolute",
      display: "inline-block",
      background: "rgba(0, 0, 0, 0.3)",
      left: video_el.offsetLeft + data.x * (video_el.offsetWidth / 1920),
      top: video_el.offsetTop + data.y * (video_el.offsetHeight / 1080),
      width: data.width * (video_el.offsetWidth / 1920),
      height: data.height * (video_el.offsetHeight / 1080),
    };
  };

  return (
    <>
      {video.platform === "YOUTUBE" && (
        <YouTube
          id="video"
          videoId={video.url.substr(32, 11)}
          opts={opts}
          onReady={onReady}
        />
      )}
      {(video.platform === "SBS" || video.platform === "직접 업로드") && (
        <div>
          <video
            id="video"
            src={videoUrl}
            width={videoWidth}
            controls
            ref={videoRef}
          />
        </div>
      )}
      {/* {currentTime > 0 && <img className="make_ai_model_draw_img" src={make_image_path + String(video.idx) + "/draw_images/" + String(parseInt(currentTime * 29.97)).padStart(5, '0') + ".jpg"}/>} */}
      {itemRect.map((value, key) => (
        <div key={key} style={value} />
      ))}
    </>
  );
};

export default VideoPlayer;
