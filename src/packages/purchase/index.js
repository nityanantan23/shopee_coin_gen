const axios = require("axios");
const { baseUrl } = require("../../config");

const add_to_cart = ({ token, uToken }) => {
  const cookies = [`SPC_EC=${token}`, `SPC_U=${uToken}`];

  return axios
    .post(
      `${baseUrl.mall}/api/v4/cart/add_to_cart`,
      {
        quantity: 1,
        donot_add_quantity: false,
        client_source: 1,
        shopid: 263450935,
        itemid: 9103836442,
        modelid: 80812441772,
      },
      { headers: { Cookie: cookies.join(";") } }
    )
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

const orderinfo = ({ token }) => {
  const cookies = [`SPC_EC=${token}`];

  return axios
    .get(`${baseUrl.mall}/api/v1/orders?limit=10&offset=0&order_type=1`, {
      headers: { Cookie: cookies.join(";") },
    })
    .then((res) => res.data.orders[0].raw)
    .catch((err) => err.response.data);
};

const foodpanda = ({ ordersn }) => {
  const url = `http://cvp-server-6ed6lgciwq-as.a.run.app/api/shopee/order/redeem?ordersn=${ordersn}&userName=nityanantan`;

  return axios
    .get(url)
    .then((res) => res.data.items[0].accounts[0])
    .catch((err) => err.response.data);
};

const cancelorder = ({ token, orderid, userAgent, shopid, csrftoken }) => {
  const cookies = [
    `SPC_EC=${token}`,
    `UA=${userAgent}`,
    `csrftoken=${csrftoken}`,
  ];

  const uri = `https://mall.shopee.com.my/bridge_cmd?cmd=reactPath?tab%3Dbuy%26path%3Dshopee%252FORDER_DETAIL%253ForderId%253D${orderid}%2526shopId%253D${shopid}`;

  const encoded = encodeURI(uri);

  return axios
    .post(
      `${baseUrl.mall}/api/v2/order/buyer_cancel_order`,
      {
        orderid: orderid,
        shopid: shopid,
        reason: 9,
      },
      {
        headers: {
          Cookie: cookies.join(";"),
          referer: uri,
          ["x-csrftoken"]: csrftoken,

          // ["x-csrftoken"]: `j9D3Jt2eC7pAygTIp6HOGvDDq6okBKg7`,
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

const getcsrf = () => {
  var result = "";
  const length = 32;
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

console.log(getcsrf);

module.exports = {
  add_to_cart,
  orderinfo,
  foodpanda,
  cancelorder,
  getcsrf,
};
