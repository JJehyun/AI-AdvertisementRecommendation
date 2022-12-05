import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getCookie } from "./cookies";

const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !getCookie("boshow_token") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/video_add",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AuthRoute;