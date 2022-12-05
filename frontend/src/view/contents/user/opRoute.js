import React from "react";
import { Redirect, Route } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { getCookie, removeCookie } from "./cookies";
import useSWR from "swr";
import { fetchWithToken } from "../../../fetcher";

const OpRoute = ({ component: Component, ...rest }) => {
  const { data: userInfo, error } = useSWR(
    ["/FindUserDetails", getCookie("boshow_token")],
    fetchWithToken
  );

  const checkToken = () => {
    if (getCookie("boshow_token")) {
      const token = getCookie("boshow_token");
      const decodeToken = jwt_decode(token);
      const expConvertDate = new Date(decodeToken.exp * 1000);
      const currentTime = new Date();
      const calc =
        (expConvertDate.getTime() - currentTime.getTime()) / 1000 / 60;

      if (calc < 0) {
        // 토큰 만료시
        removeCookie("boshow_token");
        return false;
      } else {
        return true;
      }
    }

    return false;
  };

  const checkTier = () => {
    if (userInfo && userInfo.tier > 1) {
      return true;
    }
    return false;
  };

  return (
    <Route
      {...rest}
      render={(props) =>
        checkToken() && checkTier() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default OpRoute;
