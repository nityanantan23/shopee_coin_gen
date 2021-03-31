const boardgame = require("../packages/boardgame");
const account = require("../packages/account");
const { userAgent, boardGameId } = require("../config");
const purchase = require("../packages/purchase");
const logger = require("../utils/logger");
require("dotenv").config();

(async () => {
  try {
    const csrftoken = await purchase.getcsrf();
    const rollId = 31757;
    const userId = process.env.USER_ID;
    const deviceId = process.env.DEVICE_ID;
    const shopeeToken = process.env.SHOPEE_TOKEN;
    const name = process.env.NAME;

    const token = await account.getFeatureToggles({
      shopeeToken,
      userAgent,
      userId,
    });

    const rollStatus = await boardgame.rollStatus({
      token,
      rollId,
      eventId: boardGameId,
      userAgent,
      userId,
      deviceId,
    });

    if (rollStatus.data && rollStatus.data.token.remaining > 0) {
      const roll = await boardgame.roll({
        eventId: boardGameId,
        rollId,
        token,
        userId,
        deviceId,
        shopeeToken,
        csrftoken,
      });

      console.log(roll);

      if (roll.data && roll.data.step_action === "PLUS_POINT") {
        logger.info(`${name} gets ${roll.data.step_info.point_earned} Points`);
      }
    } else {
      console.log("roll status is 0");
    }
  } catch (err) {
    logger.error(err.toString());
  }
})();
