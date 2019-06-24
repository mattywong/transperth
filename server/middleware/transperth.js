// http://au-journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST/DataSets/PerthRestricted/StopTimetable?format=json&StopUid=PerthRestricted%3A56&Time=2019-04-28T00%3A08&ReturnNotes=true&IsRealTimeChecked=false
import fetch from "isomorphic-unfetch";
import path from "path";
import qs from "qs";
import dayjs from "dayjs";

const API_KEY = "9c7b9bdc-d80c-4b0f-8375-4ba9b2a0e0b1";
const API_URL = `http://au-journeyplanner.silverrailtech.com/journeyplannerservice/v2/REST`;

async function fetchTransperth(url, query) {
  const queryString = qs.stringify(query);

  return fetch(`${API_URL}/${url}?${queryString}`)
    .then(res => {

      console.log(res.json())
      if (res.ok) {
        return res.json();
      }


    })
    .then(data => {
      console.log(data);
      return data;
    });
}

const transperthMiddleware = async (req, res, next) => {
  console.log(req.params);

  const url = req.params[0];
  const search = req.url.split("?")[1];
  console.log(url, search);
  const query = Object.assign(
    {
      ApiKey: API_KEY,
      Time: dayjs().format("YYYY-MM-DDTHH:mm"),
      format: "json",
    },
    qs.parse(search),
  );

  console.log(query);
  // const query = {
  //   StopUid: "PerthRestricted:56",
  //   ReturnNotes: true,
  //   IsRealTimeChecked: false
  // };

  // console.log(parsedUrl);

  const data = await fetchTransperth(url, query).catch(next);

  console.log(data);

  res.locals.transperth = data;
  next();
};

export default transperthMiddleware;
