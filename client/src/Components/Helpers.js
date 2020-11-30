import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getCookie } from "../Authentication/cookies.js";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        getCookie("role") !== null ? (
          <Component {...props} />
        ) : (
          <Redirect to="localhost:3001" />
        )
      }
    />
  );
};

export default PrivateRoute;
