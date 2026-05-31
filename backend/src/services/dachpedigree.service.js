const axios = require('axios');

const cheerio = require('cheerio');

async function scrapeDog(url) {

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  /*
  |--------------------------------------------------------------------------
  | NAME
  |--------------------------------------------------------------------------
  */

  const name = $('h1').first().text().trim();

  /*
  |--------------------------------------------------------------------------
  | PHOTO
  |--------------------------------------------------------------------------
  */

  let photo = $('img').first().attr('src') || '';

  if (
    photo &&
    !photo.startsWith('http')
  ) {
    photo =
      'https://www.dachpedigrees.com' + photo;
  }

  /*
  |--------------------------------------------------------------------------
  | TITLES
  |--------------------------------------------------------------------------
  */

  const titles =
    $('body').text().match(/CH|JCH|INTCH/g)
      ? $('body').text()
      : '';

  /*
  |--------------------------------------------------------------------------
  | GENERATE RANDOM ID
  |--------------------------------------------------------------------------
  */

  const id =
    Math.floor(
      100000 + Math.random() * 900000
    );

  return {

    id,

    name,

    photo,

    url,

    titles,

    color: '',

    breed: '',

    padreId: null,

    madreId: null
  };
}

module.exports = {
  scrapeDog
};