const fs = require("fs");
const boardgame = require("../packages/boardgame");
const account = require("../packages/account");
const { userAgent, boardGameId } = require("../config");
const purchase = require("../packages/purchase");
const logger = require("../utils/logger");

(async () => {
  try {
    const raw = fs.readFileSync("credentials.json");
    const credentials = JSON.parse(raw);
    const csrftoken = await purchase.getcsrf();
    const rollId = 31757;

    for (let i = 0; i < credentials.length; i++) {
      const { userId, deviceId, shopeeToken, name } = credentials[i];

      if (!shopeeToken) {
        continue;
      }
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
          logger.info(
            `${name} gets ${roll.data.step_info.point_earned} Points`
          );
        }
      } else {
        console.log("roll status is 0");
      }
    }
  } catch (err) {
    logger.error(err.toString());
  }
})();
