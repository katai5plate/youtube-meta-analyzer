const { key: KEY } = require('./config.json');
const ARGS = require('minimist')(process.argv.slice(2));

const YouTube = require('youtube-node');
const fs = require('fs-extra');
const moment = require('moment');
const req = require('request');

moment.locale('ja');

(async () => {
  if (['', null, undefined].includes(ARGS.s)) return;
  const INPUT = ARGS.s;

  const y = new YouTube();
  y.setKey(KEY);

  const getSearch = word =>
    new Promise((ok, ng) =>
      y.search(
        word,
        // 50,
        10,
        {
          order: 'viewCount',
          regionCode: 'jp',
          type: 'video'
        },
        (e, r) => (e ? ng(e) : ok(r))
      )
    );

  const res = await getSearch(INPUT);

  const results = res.items.map(({ id: { videoId } }) => videoId);

  try {
    const name = `inputs/${INPUT}.json`;
    await fs.outputFile(name, JSON.stringify(results, null, '  '));
    console.log('FINISH');
    return;
  } catch (error) {
    console.log('SAVE ERROR', error);
  }
})();
