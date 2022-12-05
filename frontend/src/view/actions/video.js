import { VIDEO_LIST, VIDEO_LIST_SUCCESS, VIDEO_LIST_FAILURE } from "./ActionTypes";
import axios from "axios";

export const videoList = (data) => async (dispatch) => {
  dispatch({ type: VIDEO_LIST });

  return await axios
    .get("/VideoApi", { params: data })
    .then((res) => {
      if (res.data) {
        dispatch({
          type: VIDEO_LIST_SUCCESS,
        });

        return res.data;
      } else {
        dispatch({
          type: VIDEO_LIST_FAILURE,
        });

        return false;
      }
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const videoAdd = (data) => async (dispatch) => {
  dispatch({ type: VIDEO_LIST });

  return await axios
    .post("/VideoApi", null, { params: data })
    .then((res) => {
      if (res.data) {
        dispatch({
          type: VIDEO_LIST_SUCCESS,
        });

        return true;
      } else {
        dispatch({
          type: VIDEO_LIST_FAILURE,
        });

        return false;
      }
    })
    .catch((err) => {
      console.warn(err);
    });
};
