// http://au-journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/PerthRestricted/StopTimetable?format=json&StopUid=PerthRestricted%3A56&Time=2019-04-28T00%3A08&ReturnNotes=true&IsRealTimeChecked=false
import fetch from "isomorphic-unfetch";
import qs from "qs";
import dayjs from "dayjs";

const API_KEY = "9c7b9bdc-d80c-4b0f-8375-4ba9b2a0e0b1";
const API_URL = `http://au-journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/PerthRestricted/StopTimetable`;

async function getTransperth(query) {
  const queryString = qs.stringify(query);
  const res = await fetch(`${API_URL}?${queryString}`);
  let error;

  if (!res.ok) {
    // console.log(res);
    error = Error(res.statusText);
    error.status = res.status;
    error.url = res.url;
    throw error;
  }

  return res.json();
}

const transperthMiddleware = async (req, res, next) => {
  const query = {
    ApiKey: API_KEY,
    format: "json",
    StopUid: "PerthRestricted:56",
    Time: dayjs().format("YYYY-MM-DDTHH:mm"),
    ReturnNotes: true,
    IsRealTimeChecked: false
  };
  // console.log(query);

  const data = await getTransperth({ ...query, ...req.query })
    .then(data => {
      return data;
    })
    .catch(next);

  res.locals.transperth = data;
  next();
};

export default transperthMiddleware;
