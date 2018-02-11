import { Dictionary } from "../dictionary/dictionary.js";
import GoogleImages from "google-images";
import "isomorphic-fetch";

const imageSearch = new GoogleImages(
  Meteor.settings.googleSearch[0].engineId,
  Meteor.settings.googleSearch[0].apiKey
);
export const searchWords = () =>
  Dictionary.find(
    { $or: [{ id: randNum() }, { id: randNum() }, { id: randNum() }] },
    { fields: { _id: 0, word: 1 } }
  )
    .fetch()
    .map(obj => obj.word)
    .join(" ") + " imagesize:500x500";

export const getUrl = async () => {
  let url = undefined;
  let seedWords = undefined;
  while (!url) {
    seedWords = searchWords();
    const imageObj = await imageSearch.search(seedWords);
    if (imageObj[0]) {
      url = imageObj[Math.floor(Math.random() * imageObj.length)].url;
      /\.jpg|\.png|\.gif|\.jpeg/.test(url)
        ? await fetch(url)
            .then(res => {
              console.log(res.headers.get("content-type"));

              if (!/^image/.test(res.headers.get("content-type")))
                throw new Error("not actually an image.. c'mon google!");
            })
            .catch(e => {
              console.log(e.message);
              url = undefined;
            })
        : (url = undefined);
    }
  }
  return [url, seedWords.slice(0, -18)];
};

export const randNum = () => Math.floor(Math.random() * 143090).toString();