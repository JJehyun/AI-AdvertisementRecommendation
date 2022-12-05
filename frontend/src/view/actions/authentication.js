import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_JOIN,
  AUTH_JOIN_SUCCESS,
  AUTH_JOIN_FAILURE,
} from "./ActionTypes";
import axios from "axios";
import { setCookie } from "../contents/user/cookies";

export const login = (data) => (dispatch) => {
  dispatch({ type: AUTH_LOGIN });

  return axios
    .post("/Login", null, { params: data })
    .then((res) => {
      if (res.data) {
        setCookie("boshow_token", res.data);

        dispatch({
          type: AUTH_LOGIN_SUCCESS,
          payload : data.user_id
        });

        return Promise.resolve(true);
      } else {
        dispatch({
          type: AUTH_LOGIN_FAILURE,
        });

        return Promise.resolve(false);
      }
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const certificateAuth = (data) => (dispatch) => {
  dispatch({ type: AUTH_LOGIN });

  return axios
    .post("/CertificateAuth", null, { params: data })
    .then((res) => {
      if (res.data.result) {
        dispatch({
          type: AUTH_LOGIN_SUCCESS,
        });
      } else {
        dispatch({
          type: AUTH_LOGIN_FAILURE,
        });
      }
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const emailCertification = (data) => (dispatch) => {
  dispatch({ type: AUTH_LOGIN });

  return axios
    .post("/EmailCertification", null, { params: data })
    .then((res) => {
      dispatch({
        type: AUTH_LOGIN_SUCCESS,
      });

      return Promise.resolve(true);
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const modifyPw = (data) => (dispatch) => {
  dispatch({ type: AUTH_LOGIN });

  return axios
    .post("/ModifyPW", null, { params: data })
    .then((res) => {
      dispatch({
        type: AUTH_LOGIN_SUCCESS,
      });

      return Promise.resolve(true);
    })
    .catch((err) => {
      console.warn(err);
    });
};

export const join = (data) => (dispatch) => {
  dispatch({ type: AUTH_JOIN });

  console.log(data);
  return axios
    .post("/Join", null, { params: data })
    .then((res) => {
      if (res.data) {
        dispatch({
          type: AUTH_JOIN_SUCCESS,
        });

        return Promise.resolve(true);
      } else {
        dispatch({
          type: AUTH_JOIN_FAILURE,
        });

        return Promise.resolve(false);
      }
    })
    .catch((err) => {
      console.warn(err);
    });
};
