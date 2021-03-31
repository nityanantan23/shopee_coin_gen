const fs = require("fs");
const { userAgent } = require("../config");
const coins = require("../packages/coins");
const account = require("../packages/account");
const logger = require("../utils/logger");
require("dotenv").config();

(async () => {
  try {
    const userId = process.env.USER_ID;
    const shopeeToken = process.env.SHOPEE_TOKEN;
    const name = process.env.NAME;

    let total = 0;

    const arr = [];

    const token = await account.getFeatureToggles({
      userId,
      shopeeToken,
      userAgent,
    });
    const userCoin = await coins.getUserCoins({ token, userAgent });
    total += userCoin;
    arr.push({ name, userCoin });
    console.log(`${name} gets ${userCoin} coin`);

    console.table(arr, ["name", "userCoin"]);
    console.table({ Total: total });
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
})();
