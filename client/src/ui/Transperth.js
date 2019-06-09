import React from "react";

import ServerContext from "../state/ServerContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_DATA_START":
      return {
        ...state,
        loading: true,
        error: false
      };

    case "FETCH_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload.data
      };

    case "FETCH_DATA_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
};

const Transperth = props => {
  const serverState = React.useContext(ServerContext);

  const [state, dispatch] = React.useReducer(reducer, {
    data: serverState.transperth || null,
    loading: !serverState.transperth,
    error: false
  });

  const { deleteStateKey } = serverState;

  const { loading, error, data } = state;

  React.useEffect(() => {
    if (data) {
      // have to delete initial data from server
      deleteStateKey("transperth");
      return;
    }

    dispatch({
      type: "FETCH_DATA_START"
    });

    const getData = async () => {
      return fetch("/api/transperth").then(res => {
        if (res.ok) {
          return res.json();
        }
      });
    };

    getData().then(data => {
      dispatch({
        type: "FETCH_DATA_SUCCESS",
        payload: {
          data
        }
      });
    });
  }, [data, dispatch, deleteStateKey]);

  if (loading) {
    return <p>LOADING</p>;
  }
  if (error) {
    return <p>error</p>;
  }

  return (
    <div>
      {data.Notes.map(note => (
        <p key={note.Id}>{note.Description}</p>
      ))}
    </div>
  );
};

export default Transperth;
