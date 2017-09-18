const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');
const regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;


module.exports = async (value) =>
  new Promise((resolve, reject) => {
    const start = moment().format('x');
    let newLinks = [];
    request(value, (error, response, data) => {
      if (error) {
        let err = `invalid?`;
        resolve(err);
        return
      } else if (response.statusCode == '200') {
          let ch = cheerio.load(data);
          let now = moment().format('x') - start;
          let x = now / 1000;
          let secs =  x % 60;
          let sub = ch('a').map((i, elem) => {
            return ch(elem).attr('href')
          }).get().join(', ');
          let match, str = [];
          while ((match = regex.exec(sub)) !== null) {
            if (match.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            match.forEach((match, groupIndex) => {
              str.push(match)[groupIndex];
            });
          }
          let uniqueArray = (arrArg) => {
            return arrArg.filter((elem, pos, arr) => {
              return arr.indexOf(elem) == pos;
            })
          }
          newLinks = [secs, ...uniqueArray(str)];
          resolve(newLinks);
      }
    })
  })
