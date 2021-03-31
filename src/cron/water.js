const plant = require("../packages/plant");
const account = require("../packages/account");
require("dotenv").config();
const logger = require("../utils/logger");
const { userAgent } = require("../config");
const STATES = ["Bibit", "Pohon", "Berbuah"];

const display = ({ state, exp, name, totExp }) => {
  let st = "Panen";
  if (state < 4) {
    st = `${STATES[state - 1]} (${state})`;
  }

  console.table({ Name: name, State: st, "Curr Exp": exp, "Tot. Exp": totExp });
};

(async () => {
  try {
    const userId = process.env.envkey_USER_ID;
    const deviceId = process.env.envkey_DEVICE_ID;
    const shopeeToken = process.env.envkey_SHOPEE_TOKEN;
    const name = process.env.envkey_NAME;

    const token = await account.getFeatureToggles({
      userId,
      shopeeToken,
      userAgent,
    });
    const myCrop = await plant.getMyCrop({ token });

    if (myCrop.code === 0) {
      const currResource = myCrop.data.resources[0];
      const currCrop = myCrop.data.crops[0];

      if (currResource.number > 0) {
        // Water crop
        const water = await plant.waterCrop({
          token,
          cropId: currCrop.id,
          resourceId: currResource.id,
        });
        // console.log(water);

        if (water.code === 0) {
          logger.info(`${name} pour ${water.data.useNumber} water`);
        }
      }

      const myNewCrop = await plant.getMyCrop({ token });

      if (myNewCrop.code === 0) {
        const currCrop = myNewCrop.data.crops[0];

        if (
          currCrop.state === 100 ||
          currCrop.state === 101 ||
          currCrop.state === 2
        ) {
          // Harvest crop
          const harvest = await plant.harvestCrop({
            token,
            deviceId,
            cropId: currCrop.id,
          });

          if (harvest.code === 0) {
            const reward = harvest.data.reward.rewardItems[0].num;

            logger.info(`${name} gets ${reward} coin`);
          }
          const crops = await plant.getCrop({ token });

          const nCrop = crops.data.cropMetas[0];

          const plant = await plant.createCrop({ id: nCrop.id, token });

          if (plant.code === 0) {
            logger.info(`${name} plants ${nCrop.name}`);
          }
        }

        display({
          state: currCrop.state,
          exp: currCrop.exp,
          name: currCrop.meta.name,
          totExp: currCrop.meta.config.totalExp,
        });
      }
    }
  } catch (err) {
    logger.error(err);
  }
})();
