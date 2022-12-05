import axios from "axios";

export const fetcher = (url) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data);

export const fetchWithToken = (url, token) =>
  axios
    .get(url, {
      params: { boshow_token: token },
    })
    .then((response) => response.data[0]);
