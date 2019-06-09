import React from "react";
import dayjs from "dayjs";

import { Link, Route } from "react-router-dom";
import ServerContext from "../state/ServerContext";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_IS_SERVER":
      return {
        ...state,
        isServer: action.payload.isServer
      };
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
  console.log(props);

  const { location } = props;
  const { search } = location;

  const serverState = React.useContext(ServerContext);

  const [state, dispatch] = React.useReducer(reducer, {
    data: serverState.transperth || null,
    loading: !serverState.transperth,
    error: false,
    isServer: !!serverState.transperth
  });

  const { deleteStateKey } = serverState;
  const { loading, error, data, isServer } = state;

  const url = location.pathname.replace(/\/transperth\//, "");

  console.log(state);

  const handleRouteLinkClick = React.useCallback(() => {
    dispatch({
      type: "SET_IS_SERVER",
      payload: {
        isServer: false
      }
    });
  }, [dispatch]);

  React.useEffect(() => {
    if (isServer) {
      return;
    }

    console.log(url);

    dispatch({
      type: "FETCH_DATA_START"
    });

    const getData = async () => {
      return fetch(`/api/transperth/${url}${search}`).then(res => {
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
  }, [serverState, deleteStateKey, dispatch, location, url, search, isServer]);

  // if (loading) {
  //   return <p>LOADING</p>;
  // }
  // if (error) {
  //   return <p>error</p>;
  // }

  return (
    <div>
      <Link
        onClick={handleRouteLinkClick}
        to="/transperth/DataSets/PerthRestricted/StopTimetable?StopUid=PerthRestricted%3A31&ReturnNotes=true&IsRealTimeChecked=false"
      >
        CITY WEST
      </Link>
      <Link
        onClick={handleRouteLinkClick}
        to="/transperth/DataSets/PerthRestricted/StopTimetable?StopUid=PerthRestricted%3A56&ReturnNotes=true&IsRealTimeChecked=false"
      >
        PERTH
      </Link>
      {error && <div>ERROR</div>}
      {!error && loading ? (
        <div>Loading..</div>
      ) : (
        <table>
          <tbody>
            {data.Trips.map(trip => (
              <tr key={trip.Summary.TripSourceId}>
                <td>To {trip.Destination.Name}</td>
                <td>{dayjs(trip.DepartTime).format("hh:mma")}</td>
              </tr>
            ))}

            <tr>
              <td />
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transperth;
