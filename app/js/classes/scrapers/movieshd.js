const request = require('request')
const cheerio = require('cheerio')

class MoviesHD {

  constructor () {
    this.base_url = 'http://www.pelispedia.tv'
    this.search_url_start = 'https://www.google.co.uk/search?q='
    this.search_url_end = '&sitesearch=pelispedia.tv&gws_rd=cr&ei=wOAcWMuJA8aZwgSf_ouIDQ'
  }

  getMoviePage (title) {
    let url = this.search_url_start + encodeURI(title) + this.search_url_end

    return new Promise(function (resolve, reject) {
      request(url, function (error, response, body) {
        console.log(url)
        let $ = cheerio.load(body)
        if ($('.g').length === 0) {
          reject('No Sources')
          return false
        }

        $('.g:first-child').filter(function () {
          let href = $(this).find('a').attr('href')
          let hrefModified = href.substr(0, href.lastIndexOf('/'))
          href = hrefModified + '/'
          href = href.replace('/url?q=', '')

          request(href, function (error, response, body) {
            console.log(href)
            let $ = cheerio.load(body)

            let keyUrl = $('.repro iframe').attr('src')

            if (!keyUrl) {
              reject('This shit did not work')
              return false
            }

            request({
              url: keyUrl,
              headers: {
                Referer: href
              },
            }, function (error, response, body) {
              console.log(keyUrl)
              let $ = cheerio.load(body)
              $('#botones').filter(function () {
                let sourcesUrl = $(this).find('a:first-child').attr('href')

                request({
                  url: sourcesUrl,
                  headers: {
                    Referer: keyUrl,
                  },
                }, function (error, response, body) {
                  console.log(sourcesUrl)
                  let $ = cheerio.load(body)
                  if ($.html() === 'No disponible') {
                    reject('No Sources')
                  }
                  $('head').remove()

                  $('script:last-child').filter(function (e) {
                    let jsonTest = $(this).html()
                    let sources = []
                    console.log(jsonTest.match(/\[(.*)\]/g));
                    jsonTest = jsonTest.split("'")

                    jsonTest.forEach(function (url) {
                      if (url.indexOf('redirector.googlevideo.com') !== -1) {
                        sources.push(url)
                      }
                    })

                    if (sources.length === 0) {
                      reject('No Sources')
                      return false
                    } else {
                      resolve(sources)
                      return false
                    }
                  })
                })
              })
            })
          })
        })
      })
    })
  }
}

module.exports = MoviesHD
