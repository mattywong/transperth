import React from "react";

export const useServerContext = ServerState => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "DELETE_SERVER_STATE":
        if (state[action.payload.key]) {
          const nextState = { ...state };
          delete nextState[action.payload.key];
          return nextState;
        }
        return state;
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, ServerState);

  const deleteStateKey = React.useCallback(
    key =>
      dispatch({
        type: "DELETE_SERVER_STATE",
        payload: {
          key
        }
      }),
    [dispatch]
  );

  return {
    state,
    deleteStateKey
  };
};

export const ServerContext = React.createContext();

export default { ServerContext, useServerContext };
