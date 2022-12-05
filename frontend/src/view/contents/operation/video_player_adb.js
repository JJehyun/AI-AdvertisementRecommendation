import React, { useState, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import axios from "axios";

const VideoPlayerAdb = (props) => {
  const { video, itemDetail } = props;
  const [currentItemDetail, setCurrentItemDetail] = useState([]);
  const [currentTime, setCurrentTime] = useState(-100);
  const [itemRect, setItemRect] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const interval = useRef();
  const videoRef = useRef();

  const video_path = `${process.env.REACT_APP_BACKEND_HOST}static/videos/`;

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };

  useEffect(() => {
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
  });

  useEffect(() => {
    if (video.platform !== "YOUTUBE") {
      interval.current = setInterval(() => {
        setCurrentTime(videoRef.current.currentTime);
      }, 28);

      return () => {
        return clearInterval(interval.current);
      };
    }
  }, [videoRef]);

  const rectDiv = itemRect.map((value, key) => <div key={key} style={value} />);

  const onStateChange = (e) => {
    const { target, data } = e;

    if (data === 1) {
      interval.current = setInterval(() => {
        setCurrentTime(target.playerInfo.currentTime);
      }, 28);
    } else if (data === 2) {
      clearInterval(interval.current);
    }
  };

  const changeItemDetail = async () => {
    await setItemRect([]);
    let current_item_detail = {};
    let prevTime = currentTime - 0.0166666666666666666666665;
    let futureTime = currentTime + 0.0166666666666666666666665;

    current_item_detail = itemDetail.filter((data) => {
      return (
        data.position_time >= prevTime &&
        data.position_time <= futureTime &&
        data.fk_item_idx != null
      );
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
      left: data.x * (video_el.width / 1920),
      top: data.y * (video_el.height / 1080),
      width: data.width * (video_el.width / 1920),
      height: data.height * (video_el.height / 1080),
    };
  };

  return (
    <>
      {video.platform === "YOUTUBE" && (
        <YouTube
          id="video"
          videoId={video.url.substr(32, 11)}
          opts={opts}
          onStateChange={onStateChange}
        />
      )}
      {(video.platform === "SBS" || video.platform === "직접 업로드") && (
        <div>
          <video
            id="video"
            src={videoUrl}
            width="450"
            controls
            ref={videoRef}
          />
        </div>
      )}
      {/*{rectDiv}*/}
    </>
  );
};

export default VideoPlayerAdb;
