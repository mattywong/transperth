import React from "react";
import { Route } from "react-router-dom";
const HttpStatus = ({ code, children }) => {
  return (
    <Route
      render={props => {
        const { staticContext } = props;
        if (staticContext) {
          staticContext.status = code;
        }

        return children;
      }}
    />
  );
};

export default HttpStatus;
