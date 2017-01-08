const request = require('request');

class IMDB {

  constructor() {
    this.request = request;
    this.url = 'http://www.omdbapi.com/?i=';
    this.return = '&plot=full&r=json';
  }

  getCovers(uniqueID) {
    let url = this.url;
    let format = this.return;
    return new Promise(function (fulfill, reject) {
      this.request({
        url: url + uniqueID + format,
      }, function (error, response, body) {
        if (error) reject(JSON.parse(body));
        else fulfill(JSON.parse(body));
      });
    });
  }
}

module.exports = IMDB;
