import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const VideoBox = (props) => {
  const { video } = props;
  const [videoUrl, setVideoUrl] = useState("");

  const image_path = `${process.env.REACT_APP_BACKEND_HOST}static/`;
  const video_path = image_path + "videos/";
  
  useEffect(() => {
    let video_url = "";

    switch (video.platform) {
      case "YOUTUBE":
        video_url = "https://www.youtube.com/embed/" + video.url.substr(32, 11);
        break;
      case "SBS":
        let url = video.url.split("?")[0];
        let SBS_video_id = url.split("/");
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
                video_url = response.data.mediaurl;
              });
          });
        break;
      case "직접 업로드":
        video_url = video_path + video.idx + "." + video.url;
        break;
    }

    setVideoUrl(video_url);
  }, []);

  return (
    <div>
      {video.platform === "YOUTUBE" && (
        <iframe
          src={videoUrl}
          width="575"
          height="323"
          controls
          style={{ borderRadius: "5px" }}
        />
      )}
      {(video.platform === "SBS" || video.platform === "직접 업로드") && (
        <video
          src={videoUrl}
          width="575"
          height="323"
          controls
          style={{ borderRadius: "5px" }}
        />
      )}
    </div>
  );
};

export default VideoBox;
