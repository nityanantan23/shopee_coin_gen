const axios = require("axios");

const baseUrl = "https://play.shopee.com.my";

const roll = ({
  eventId,
  rollId,
  token,
  userId,
  deviceId,
  shopeeToken,
  csrftoken,
}) => {
  const cookies = [
    `SPC_EC=${token}`,
    `shopee_token=${shopeeToken}`,
    `csrftoken=${csrftoken}`,
  ];

  return axios
    .post(
      `${baseUrl}/api/boardgame-be/v2/events/${eventId}/roll/${rollId}`,
      {
        "meta_df": "45609878b88f13ba_unknown",
        "meta_event_code": 8,
        "meta_service_code": 1,
        "meta_tb": "eyJvcyI6ImFuZHJvaWQiLCJ2ZXJzaW9uIjoiMy4zLjQiLCJwYWNrYWdlcyI6ImNvbS5zaG9wZWUubXkqJjIuNjcuMjEiLCJwcm9maWxlX3RpbWUiOjE5OCwiaW50ZXJ2YWxfdGltZSI6NjI3NTE4LCJ0b2tlbl9pZCI6InloOXlhdllWZ0VYUnIwejdTdllQQ09pXC9CQmx6V2FxTEtXRG5QU2lOcnV0K2dUZWlNSVV3KzYwcTlXTkJPNElJekdGNEFTWm9pYzlwNCtvNzlzRG5vTUFPNDA5RmdZZnRTZ3lqQmZrR1N3WT0ifQ\u003d\u003d",
        "meta_ua_type": 2,
        "meta_ver": "YzJmZDI5YzJhMjEzOTRkZWE0MzdmMzQyYTk2YjczZWYyNjcyMQ\u003d\u003d"
      },
      {
        headers: {
          Cookie: cookies.join(";"),
          "x-tenant": "my",
          "x-user-id": userId,
          "x-device-id": deviceId,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

const rollStatus = ({
  eventId,
  rollId,
  userAgent,
  userId,
  deviceId,
  token,
}) => {
  const cookies = [`SPC_EC=${token}`, `UA=${userAgent}`];

  return axios
    .get(`${baseUrl}/api/boardgame-be/v2/events/${eventId}/state/${rollId}`, {
      headers: {
        Cookie: cookies.join(";"),
        "x-tenant": "my",
        "x-user-id": userId,
        "x-device-id": deviceId,
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

module.exports = { roll, rollStatus };
