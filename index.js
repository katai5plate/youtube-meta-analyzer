const INPUT = require('./input.json');
const { key: KEY } = require('./config.json');
const YouTube = require('youtube-node');
const fs = require('fs-extra');
const moment = require('moment');
const req = require('request');

moment.locale('ja');

(async () => {
  const y = new YouTube();
  y.setKey(KEY);

  const sleep = ms => new Promise(f => setTimeout(f, ms));
  const getCategories = () =>
    new Promise((ok, ng) =>
      req.get(
        `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=jp&key=${KEY}`,
        (e, r) => (e ? ng(e) : ok(r))
      )
    );
  const getVideoData = id =>
    new Promise((ok, ng) => y.getById(id, (e, r) => (e ? ng(e) : ok(r))));

  let CATEGORIES = [];
  try {
    CATEGORIES = JSON.parse((await getCategories()).body).items;
    console.log('DONE FETCH CATEGORIES');
  } catch (error) {
    console.log('FETCH CATEGORIES ERROR', error);
    return;
  }

  let results = [];
  let res = {};

  for (let id of INPUT) {
    for (let timeout = 0; timeout < 5; timeout++) {
      if (timeout === 0) {
        console.log('READY', id);
      } else {
        console.log('RETRY', id);
      }
      await sleep(1000);
      try {
        res = await getVideoData(id);
        console.log('DONE', id);
        break;
      } catch (e) {
        console.log('TIMEOUT', id, e);
      }
    }
    const {
      title,
      channelTitle: author,
      publishedAt,
      categoryId,
      tags
    } = res.items[0].snippet;
    results = [
      ...results,
      {
        id,
        title,
        author,
        at: moment(publishedAt).toISOString(),
        atJP: moment(publishedAt).format('YYYY年MM月DD日(dd) HH時mm分ss秒'),
        categoryId,
        categoryName: CATEGORIES.filter(({ id: cid }) => cid === categoryId)[0]
          .snippet.title,
        tags: tags
      }
    ];
  }

  try {
    await fs.outputFile(
      `export/result_${new Date()
        .toJSON()
        .replace(/-|T|:|\.|Z/g, ',')
        .split(',')
        .slice(0, -1)
        .join('-')}.json`,
      JSON.stringify(results, null, '  ')
    );
    console.log('FINISH');
    return;
  } catch (error) {
    console.log('SAVE ERROR', error);
  }
})();
