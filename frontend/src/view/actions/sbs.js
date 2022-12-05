import { SBS_API, SBS_API_SUCCESS, SBS_API_FAILURE } from "./ActionTypes";
import axios from "axios";

const makeSbsToken = () => {
  return axios
    .get("/MakeSbsToken", null)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const sbsApi = (SBS_video_id) => async (dispatch) => {
  dispatch({ type: SBS_API });

  const data = await makeSbsToken();
  return await axios
    .get(
      "http://apis.sbs.co.kr/play-api/ad-admin/1.0/boshow/media/" +
        SBS_video_id +
        "?pnw-token=" +
        data.token,
      null
    )
    .then((res) => {
      if (res.data) {
        dispatch({
          type: SBS_API_SUCCESS,
        });

        return res.data;
      } else {
        dispatch({
          type: SBS_API_FAILURE,
        });

        return false;
      }
      // return Promise.resolve(res.data.token);
    })
    .catch((err) => {
      console.warn(err);
    });
};
