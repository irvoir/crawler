const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;


module.exports = async (value) =>
  new Promise((resolve, reject) => {
    const start = moment().format('x');
    request(value, (error, response, data) => {
      if (error) {
        let err = `invalid`;
        resolve(err);
        return
      } else if (response.statusCode == '200') {
        let arr = new Array;
        let ch = cheerio.load(data);
        let links = ch('a').length;
        let scripts = ch('script').length;
        let images = ch('img').length;
        let now = moment().format('x') - start;
        let x = now / 1000;
        let secs =  x % 60;
        arr = [links, scripts, images, secs];
        resolve(arr);
      }
    })
  })
