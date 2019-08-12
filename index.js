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
  const JSONtoCSV = (arr, columns, delimiter = ',') =>
    [
      columns.join(delimiter),
      ...arr.map(obj =>
        columns.reduce(
          (acc, key) =>
            `${acc}${!acc.length ? '' : delimiter}"${
              !obj[key] ? '' : obj[key]
            }"`,
          ''
        )
      )
    ].join('\n');

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
    const resData = res.items[0].snippet;
    // console.log(resData);
    const {
      title,
      channelTitle: author,
      publishedAt,
      categoryId,
      tags,
      description
    } = resData;
    const hashtags =
      description.match(
        /[#＃][Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー._-]+/gm
      ) || [];
    const links =
      description.match(
        /(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/gm
      ) || [];
    results = [
      ...results,
      {
        id,
        title,
        title24: title.slice(0, 24),
        title28: title.slice(0, 28),
        author,
        at: moment(publishedAt).format('YYYY/MM/DD HH:mm:ss'),
        atJP: moment(publishedAt).format('YYYY年MM月DD日(dd) HH時mm分ss秒'),
        categoryId,
        categoryName: CATEGORIES.filter(({ id: cid }) => cid === categoryId)[0]
          .snippet.title,
        tags,
        tagSize: tags.length,
        description: JSON.stringify(description),
        description3: JSON.stringify(description)
          .split('\\n')
          .slice(0, 3)
          .join('\\n'),
        hashtags,
        hashtagSize: hashtags.length,
        links,
        linkSize: links.length
      }
    ];
  }

  try {
    const name = `export/result_${new Date()
      .toJSON()
      .replace(/-|T|:|\.|Z/g, ',')
      .split(',')
      .slice(0, -1)
      .join('-')}`;

    await fs.outputFile(`${name}.json`, JSON.stringify(results, null, '  '));
    const csvResults = results.map(
      ({ id, title, author, at, categoryName, tags, hashtags, links }) => ({
        id,
        title,
        author,
        at,
        categoryName,
        tags: tags.join(', '),
        hashtags: hashtags.join(' '),
        links: links.join(' ')
      })
    );
    await fs.outputFile(
      `${name}.csv`,
      JSONtoCSV(csvResults, Object.keys(csvResults[0]))
    );

    console.log('FINISH');
    return;
  } catch (error) {
    console.log('SAVE ERROR', error);
  }
})();
