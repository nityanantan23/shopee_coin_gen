const fs = require("fs");
const FormData = require("form-data");
const account = require("../packages/account");

const live = require("../packages/live");
const logger = require("../utils/logger");
const { userAgent } = require("../config");
require("dotenv").config();

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

(async () => {
  try {
    const userId = process.env.USER_ID;
    const deviceId = process.env.DEVICE_ID;
    const shopeeToken = process.env.SHOPEE_TOKEN;
    const name = process.env.NAME;

    const dt = new Date();
    const ts = dt.getTime();

    const token = await account.getFeatureToggles({
      shopeeToken,
      userAgent,
      userId,
    });

    const options = {
      offset: 0,
      limit: 50,
      tab_type: 0,
      tab_id: 1224868080340480,
      device_id: deviceId,
      ctx_id: `${deviceId}-${ts}-79`,
    };

    const streams = await live.getLivestreams(options);
    if (streams.err_code === 0 && streams.data.list.length > 0) {
      let max = 0;
      const paidStreams = streams.data.list.filter((str) => {
        const coin = str.item.coins_per_claim;
        if (coin > max) {
          max = coin;
          return true;
        }
      });
      const stream = paidStreams[paidStreams.length - 1];
      if (stream) {
        const claimStatus = await live.claimStatus({
          uid: stream.item.uid,
          token,
          sessId: stream.item_id,
        });

        const joinStream = await live.joinStream({
          sessId: stream.item_id,
          token,
          deviceId,
        });

        if (claimStatus.data.claim_times_left > 0) {
          await live.lockCoin({
            sessId: stream.item_id,
            uid: stream.item.uid,
            userAgent,
            token,
          });
          const formData = new FormData();
          formData.append(
            "PLAY_EVT_PLAY_BEGIN",
            joinStream.data.session.play_url
          );
          formData.append(
            "JDfbN4Q7aHETNLOEnYJ6/nLFUu8v84hAEkD/pS3or5E",
            "* xiaomiRedmi Note 50:29B 26008J P Z IDb j 1.1.9p"
          );
          for (let j = 0; j < claimStatus.data.required_watch_time / 10; j++) {
            await live.reportPB({
              token,
              data: formData,
            });
            await sleep(1000 * 10);
          }

          const cclaim = await live.canClaim({
            token,
            sessId: stream.item_id,
          });

          if (cclaim.err_code === 0) {
            const claim = await live.claimCoin({
              token,
              uid: stream.item.uid,
              sessId: stream.item_id,
            });

            if (claim.err_code === 0) {
              logger.info(
                `${name} gets ${claimStatus.data.coins_per_claim} coins`
              );
            }
          } else {
            console.log("error " + error);

            logger.error;
          }
        } else {
          console.log("error claim status is 0");
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
