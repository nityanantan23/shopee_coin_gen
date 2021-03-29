const coins = require("../packages/coins");
const account = require("../packages/account");
const logger = require("../utils/logger");
const {
  userAgent,
  shopee_app_version,
  shopee_rn_version,
} = require("../config");
require("dotenv").config();

//  5, 10,  15, 20, 25, 30, 150 = 255/w = 1020/m

(async () => {
  try {
    
    const userId = steps.dotenv.outputs.USER_ID;
    const language = steps.dotenv.outputs.LANGUAGE;
    const shopeeToken = steps.dotenv.outputs.SHOPEE_TOKEN;
    const name = steps.dotenv.outputs.NAME;

    console.log(name);

    const token = await account.getFeatureToggles({
      shopeeToken,
      userAgent,
      userId,
      language,
      shopee_app_version,
      shopee_rn_version,
    });

    const checkin = await coins.checkin({ token });

    console.log(checkin);

    if (checkin.code === 0 && checkin.data.success) {
      logger.info(`${name} get ${checkin.data.increase_coins} coin`);
    } else {
      logger.error(`failed`);
    }
  } catch (err) {
    console.log(err);
  }
})();
