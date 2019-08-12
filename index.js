const YouTube = require('youtube-node');
const fs = require('fs-extra');
const input = require('./input.json');

(async () => {
  const y = new YouTube();
  y.setKey(require('./config.json').key);

  const sleep = ms => new Promise(f => setTimeout(f, ms));
  const getVideoData = id =>
    new Promise((ok, ng) => y.getById(id, (e, r) => (e ? ng(e) : ok(r))));

  let results = [],
    res = {};
  for (let id of input) {
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
    results = [
      ...results,
      {
        id: res.items[0].id,
        title: res.items[0].snippet.title,
        at: res.items[0].snippet.publishedAt,
        tags: res.items[0].snippet.tags
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
