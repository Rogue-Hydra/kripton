const request = require('request')

class Trakt {
  constructor () {
    this.baseUrl = 'https://api.trakt.tv/'
    this.headers = {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': '7c685e1a76a1f73eef403727b21273d379f96bfb2aef75a8dff2d118048f9ac6',
    }
    this.method = 'GET'
    this.limit = 55
    this.request = request
  }

  getData (selection, search = false) {
    let url = this.baseUrl + selection + this.limit
    let method = this.method
    let limit = this.limit
    let contentType = this.contentType
    let key = this.key
    let version = this.version
    let request = this.request

    if (search) {
      url = this.baseUrl + selection
    }

    return new Promise(function (resolve, reject) {
      request({
        method: method,
        url: url,
        headers: {
          'Content-Type': contentType,
          'trakt-api-version': version,
          'trakt-api-key': key,
        },
        timeout: '1500',
      }, function (error, response, body) {
        let obj = JSON.parse(body)
        if (error) {
          reject(error)
        } else {
          resolve(obj)
        }
      })
    })
  }

  getRequest (url) {
    return new Promise((resolve, reject) => {
      this.request({
        method: this.method,
        url: url,
        headers: this.headers,
        timeout: '1500',
      }, (error, response, body) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(body))
        }
      })
    })
  }

  getTrending (type, limit = this.limit) {
    const url = `${this.baseUrl}${type}/trending?limit=${limit}`
    return new Promise((resolve, reject) => {
      let result = this.getRequest(url)
      result.then(() => {
        resolve(result)
      }).catch((e) => {
        reject(e)
      })
    })
  }

  getPopular (type, limit = this.limit) {
    const url = `${this.baseUrl}${type}/popular?limit=${limit}`
    return new Promise((resolve, reject) => {
      const result = this.getRequest(url)
      result.then(() => {
        resolve(result)
      }).catch((e) => {
        reject(e)
      })
    })
  }

  getMostWatched (type, limit = this.limit, period = 'monthly') {
    const url = `${this.baseUrl}${type}/watched/${period}?limit=${limit}`
    return new Promise((resolve, reject) => {
      const result = this.getRequest(url)
      result.then(() => {
        resolve(result)
      }).catch((e) => {
        reject(e)
      })
    })
  }

  getBoxOffice (type, limit = this.limit) {
    const url = `${this.baseUrl}${type}/boxoffice?limit=${limit}`
    return new Promise((resolve, reject) => {
      const result = this.getRequest(url)
      result.then(() => {
        resolve(result)
      }).catch((e) => {
        reject(e)
      })
    })
  }

  getSearch (type, query) {
    const url = `${this.baseUrl}/search/${type}?query=${query}`
    return new Promise((resolve, reject) => {
      const result = this.getRequest(url)
      result.then(() => {
        resolve(result)
      }).catch((e) => {
        reject(e)
      })
    })
  }

  getMovieInfo (type, imdbID) {
    const url = `${this.baseUrl}${type}/${imdbID}?extended=full`
    return new Promise((resolve, reject) => {
      const result = this.getRequest(url)
      result.then(() => {
        resolve(result)
      }).catch((e) => {
        reject(e)
      })
    })
  }
}

module.exports = Trakt
