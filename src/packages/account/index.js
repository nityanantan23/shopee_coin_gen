const qs = require("qs");
const axios = require("axios");
const Cookie = require("cookie");
const { baseUrl } = require("../../config");

const refresh = ({ shopeeToken, userAgent }) => {
  const cookies = [`UA=${userAgent}`, `shopee_token=${shopeeToken}`];

  const url = `${baseUrl.mall}/api/v4/client/refresh`;
  return axios
    .get(url, {
      headers: { cookie: cookies.join(";") },
    })
    .then((res) => {
      return res.headers;
    })
    .catch((err) => err.response.data);
};

const getUserInfo = () => {};

const getFeatureToggles = ({
  userId,
  userAgent,
  shopeeToken,
  language,
  shopee_rn_version,
  name,
  shopee_app_version,
}) => {
  const cookies = [
    `UA=${userAgent}`,
    `shopee_token=${shopeeToken}`,
    `userid=${userId}`,
    `language=${language}`,
    `shopee_app_version=${shopee_app_version}`,
    `username=${name}`,
    `shopee_rn_version=${shopee_rn_version}`,
  ];

  const url = `${baseUrl.mall}/api/v2/coin/get_user_coins`;

  return axios
    .get(url, {
      headers: { cookie: cookies.join(";") },
    })
    .then((res) => {
      return res.headers["set-cookie"][1];
    })
    .then((cookie) => Cookie.parse(cookie).SPC_EC)

    .catch((err) => err.response);
};

const loginStatus = ({ userAgent, shopeeToken }) => {
  const cookies = [`UA=${userAgent}`, `shopee_token=${shopeeToken}`];

  return axios.get(`${baseUrl.main}/api/v2/user/login_status`, {
    headers: { cookie: cookies.join(";") },
  });
};

module.exports = { refresh, loginStatus, getFeatureToggles, getUserInfo };
