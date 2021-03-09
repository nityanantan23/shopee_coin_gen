const axios = require("axios");
const qs = require("qs");

const { baseUrl } = require("../../config");

// every 8AM
const claim = ({ eventId, token, appId, requestId, activityId }) => {
  const cookies = [`SPC_EC=${token}`];

  const url = `${baseUrl.games}/luckydraw/api/v1/lucky/event/${eventId}`;

  return axios
    .post(
      url,
      {
        request_id: requestId,
        app_id: appId,
        activity_code: activityId,
      },
      {
        headers: { Cookie: cookies.join(";") },
      }
    )
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

const chances = ({ token, chanceId, eventId, appId }) => {
  const cookies = [`SPC_EC=${token}`];
 
  const query = {
    appid: appId,
    basic: false,
  };

  const url = `${
    baseUrl.games
  }/gameplatform/api/v1/chance/${chanceId}/event/${eventId}/query?${qs.stringify(
    query
  )}`;

  return axios
    .get(url, {
      headers: { Cookie: cookies.join(";") },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

const getActivity = ({ activityId, token, appId }) => {
  const cookies = [`SPC_EC=${token}`];
  const query = {
    appid: appId,
    basic: false,
  };

  const link = `${
    baseUrl.games
  }/gameplatform/api/v1/game/activity/${activityId}/settings?${qs.stringify(
    query
  )}`;

  return axios
    .get(link, {
      headers: { Cookie: cookies.join(";") },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

const getDailyPrize = (token) => {
  const cookies = [`SPC_EC=${token}`];

  return axios
    .get(`${baseUrl.games}/gameplatform/api/v1/page/favorite_games`, {
      headers: { Cookie: cookies.join(";") },
    })
    .then((res) => {
      for (let index = 0; index < res.data.data.game_infos.length; index++) {
        if ((res.data.data.game_infos[index].app_name === "luckybox")) {
          const activityId = res.data.data.game_infos[index].link_url;
          // console.log(activityId.split("/")[6]);
          return activityId.split("/")[6];
        }
      }
      
    })
    .catch((err) => err.response);
};


const getAppID = (token) => {
  const cookies = [`SPC_EC=${token}`];

  return axios
    .get(`${baseUrl.games}/gameplatform/api/v1/page/favorite_games`, {
      headers: { Cookie: cookies.join(";") },
    })
    .then((res) => {
      for (let index = 0; index < res.data.data.game_infos.length; index++) {
        if ((res.data.data.game_infos[index].app_name === "luckybox")) {
          const AppID = res.data.data.game_infos[index].app_id;
          return AppID;
        }
      }
      
    })
    .catch((err) => err.response);
};

// const getDailyPrize = () => {
//   return axios
//     .get(`${baseUrl.main}/Daily-Prize`, { maxRedirects: 2 })
//     .then((res) => {
//       const arr = res.request.path.split("?");
//       return arr[0].split("/")[4];
//     })
//     .catch((err) => err.response);
// };

const access = ({ activityId, token }) => {
  const cookies = [`SPC_EC=${token}`];
  const link = `${baseUrl.luckydraw}/api/v1/luckydraw/${activityId}/reports/access/`;

  return axios
    .post(
      link,
      {},
      {
        headers: { Cookie: cookies.join(";") },
      }
    )
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

module.exports = { claim, chances, getActivity, getDailyPrize, access, getAppID };
