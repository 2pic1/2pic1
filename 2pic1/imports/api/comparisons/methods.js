// Methods related to comparisons

import { Meteor } from "meteor/meteor";
import Comparisons from "./comparisons.js";
import CompMeta from "../compMeta/compMeta";
import UserData from "../userData/userData";
import {
  downloadImage,
  getGCSUrl,
  getUniqueImgNameFromSeed
} from "../helpers/imageUtils.js";
import { randNum, searchWords, getUrl } from "../helpers/comparisonUtils";

Meteor.methods({
  "comparisons.getByCompId"(compId) {
    //const hasSeen = Meteor.call("userData.userHasPicked", compId);

    return Comparisons.find(compId).fetch();
  },
  "comparisons.getRandOne"() {
    const picks = Meteor.call("userData.getPicks");
    console.log("Picks: " + picks);

    // let random = Comparisons.find({ _id: { $nin: [picks] } }).aggregate([
    //   { $sample: { size: 1 } }
    // ]);
    let random = Comparisons.aggregate([
      { $match: { _id: { $nin: [picks] } } },
      { $sample: { size: 1 } }
    ]);

    console.log(random);
    // let compId = random[0]._id;
    // while (Meteor.call("userData.userHasPicked", compId)) {
    //   console.log("has seen");
    //   random = Comparisons.aggregate([{ $sample: { size: 1 } }]);
    //   compId = random[0]._id
    // }

    // if the total number of picks for this comparison is 0, then
    // it has not been seen and we need to generate another comparison
    // for the db
    (async () => {
      total = CompMeta.aggregate([
        {
          $match: {
            $and: [
              {
                _id: random[0]._id,
                // TODO: delete on production? included as of now, since A, B is optional
                A: { $ne: null },
                B: { $ne: null }
              }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            total: { $add: ["$A", "$B"] }
          }
        }
      ]);
      // console.log(total);
      // if (total !== undefined || total[0].total === 0)
      //   Meteor.call("comparisons.addOne");
    })();
    return random;
  },
  async "comparisons.addOne"() {
    const [urlA, seedA, fileTypeA] = await getUrl();
    const [urlB, seedB, fileTypeB] = await getUrl();
    // console.log(seedA);

    const compId = new Meteor.Collection.ObjectID()._str;

    const awsUrlA = getUniqueImgNameFromSeed(compId, seedA, "A", fileTypeA);
    const awsUrlB = getUniqueImgNameFromSeed(compId, seedB, "B", fileTypeB);
    try {
      await downloadImage(urlA, awsUrlA);
      await downloadImage(urlB, awsUrlB);
    } catch (e) {
      Meteor.call("comparisons.addOne");
      console.log(e, "hey, nice catch!!~");
      return;
    }
    console.log(getGCSUrl(awsUrlA));
    console.log(getGCSUrl(awsUrlB));
    await Comparisons.insert({
      _id: compId,
      urlA: getGCSUrl(awsUrlA),
      urlB: getGCSUrl(awsUrlB)
    });

    await CompMeta.insert({
      _id: compId,
      urlA: getGCSUrl(awsUrlA),
      seedA,
      urlB: getGCSUrl(awsUrlB),
      seedB
    });
  }
});
