const request = require('request')
const getHomePath = require('home-path')
const fs = require('fs')

class Cache {

  constructor () {
    this.path = `${getHomePath()}/.kripton/`
  }

  checkCache (imdbID, type) {
    return new Promise((resolve, reject) => {
      fs.stat(`${this.path}${type}/${imdbID}.jpg`, (err, stat) => {
        if (err == null) {
          resolve(`${this.path}${type}/${imdbID}.jpg`)
        } else {
          reject('Image does not exist.')
        }
      })
    })
  }

  downloadImageToCache (url, imdbID, type) {
    return new Promise((resolve, reject) => {
      request(url).pipe(fs.createWriteStream(`${this.path}${type}/${imdbID}.jpg`)).on('close', () => {
        resolve('Downloaded Image')
      })
    })
  }
}

module.exports = Cache
