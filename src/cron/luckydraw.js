const luckydraw = require("../packages/luckydraw");
const account = require("../packages/account");
const logger = require("../utils/logger");
require("dotenv").config();
const { userAgent } = require("../config");

(async () => {
  try {
    const userId = process.env.envkey_USER_ID;
    const shopeeToken = process.env.envkey_SHOPEE_TOKEN;
    const name = process.env.envkey_NAME;

    const token = await account.getFeatureToggles({
      userId,
      userAgent,
      shopeeToken,
    });
    // Cek token
    const activityId = await luckydraw.getDailyPrize(token);
    const appId = await luckydraw.getAppID(token);

    console.log(appId);

    const activity = await luckydraw.getActivity({
      appId,
      activityId,
      token,
    });

    const access = await luckydraw.access({ activityId, token });

    const eventId = activity.data.basic.event_code;
    const chanceId = activity.data.modules[0].module_id;

    const requestId = `${userId}62422112`;
    console.log(requestId);
    console.log(appId);
    console.log(activityId);

    // const chances = await luckydraw.chances({
    //   token,
    //   eventId,
    //   chanceId,
    //   appId,
    // });

    const claim = await luckydraw.claim({
      token,
      eventId,
      appId,
      activityId,
      requestId,
    });

    console.log(claim);
    if (claim.data && claim.data.prize_type === 2) {
      logger.info(`${name} gets ${claim.data.package_name}`);
    }
  } catch (err) {
    console.log(err);
  }
})();
