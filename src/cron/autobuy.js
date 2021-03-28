const fs = require("fs");
const purchase = require("../packages/purchase");
const account = require("../packages/account");
const { userAgent, boardGameId, shopid } = require("../config");

const logger = require("../utils/logger");

//TESTING APLHA

(async () => {
  try {
    const raw = fs.readFileSync("credentials.json");
    const credentials = JSON.parse(raw);

    const userId = process.env.USER_ID;
    const deviceId = process.env.DEVICE_ID;
    const shopeeToken = process.env.SHOPEE_TOKEN;
    const name = process.env.NAME;
    const uToken = process.env.USER_ID;

    const token = await account.getFeatureToggles({
      shopeeToken,
      userAgent,
      userId,
    });

    //   add to cart foodpanda test
    //   const cart = await purchase.add_to_cart({
    //     token,
    //     uToken,
    //   });

    const order = await purchase.orderinfo({
      token,
    });

    const ordersn = order.ordersn;
    const orderid = order.orderid;

    // const fp = await purchase.foodpanda({
    //   ordersn,
    // });

    console.log("order id" + orderid);

    const csrftoken = await purchase.getcsrf();

    console.log(csrftoken);

    const cancel = await purchase.cancelorder({
      token,
      orderid,
      userAgent,
      shopid,
      csrftoken,
    });

    console.log(cancel);

    // const data = `${fp.email} : ${fp.password} \r\n`;
    // console.log(data);

    // fs.writeFile("accounts.txt", data, { flag: "a+" }, (err) => {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log("File is updated.");
    // });
  } catch (err) {
    logger.error(err.toString());
  }
})();
