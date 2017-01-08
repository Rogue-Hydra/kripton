const FanartTV = require('fanart.tv')
const Cache = require('./cache.js')
const IMDB = require('./apis/imdb.js')
const imdb = new IMDB()
const cache = new Cache()
const fanart = new FanartTV('15936c3a5ac42d7e11c2b211f2e04b4f')
const $ = require('jquery')

class Display {

  getPosters (result, category = false) {
    return new Promise((resolve, reject) => {
      result.then(function (posters) {
        $('.posters').html('')
        $.each(posters, function (i, poster) {
          let imdbID
          let title
          if (category === 'popular') {
            $('.posters').html('')
            $('.posters').hide()
            imdbID = poster.ids.imdb
            title = poster.title
          } else {
            imdbID = poster.movie.ids.imdb
            title = poster.movie.title
          }

          if (imdbID) {
            let imageCached = cache.checkCache(`${imdbID}`, 'posters')
            imageCached.then((result) => {
              displayPoster(title, imdbID, result)
            }).catch(() => {
              let fanartCovers = fanart.movies.get(imdbID)
              fanartCovers.then((result) => {
                if (typeof (result.movieposter) !== 'undefined') {
                  const posters = result.movieposter
                  let posterUrl = ''
                  posters.forEach((obj) => {
                    if (obj.lang === 'en') {
                      posterUrl = obj.url
                      return false
                    }
                  })
                  if (posterUrl) {
                    displayPoster(title, imdbID, posterUrl)
                    cache.downloadImageToCache(posterUrl, imdbID, 'posters')
                  } else {
                    let imdbResult = imdb.getCovers(imdbID)
                    imdbResult.then((result) => {
                      displayPoster(title, imdbID, result.Poster)
                      cache.downloadImageToCache(result.Poster, imdbID, 'posters')
                    }).catch(() => {
                    })
                  }
                } else {
                  let imdbResult = imdb.getCovers(imdbID)
                  imdbResult.then((result) => {
                    displayPoster(title, imdbID, result.Poster)
                    cache.downloadImageToCache(result.Poster, imdbID, 'posters')
                  }).catch(() => {
                  })
                }
              }).catch(() => {
                let imdbResult = imdb.getCovers(imdbID)
                imdbResult.then((result) => {
                  displayPoster(title, imdbID, result.Poster)
                  cache.downloadImageToCache(result.Poster, imdbID, 'posters')
                }).catch(() => {
                })
              })
            })
          }
        })
        let i = 0

        function displayPoster (title, imdbID, url) {
          if (i < 48) {
            let imgTag = `<div class="poster"><img class="movie" data-title="${title}" data-imdb="${imdbID}" src="${url}"/></div>`
            if (category === 'search') {
              $('.search-result').append(imgTag)
            } else {
              $('.posters').append(imgTag)
            }
          }
          i++
        }
      })
      resolve('done')
    })
  }

  getMovieInfo (result) {
    return new Promise((resolve, reject) => {
      result.then((movieInfo) => {
        let movieInfoPage = ''
        $('body').html('')

        let fanartImages = fanart.movies.get(movieInfo.ids.imdb)
        fanartImages.then((result) => {
          let background = result.moviebackground[ 0 ].url
          movieInfoPage += `<div><div style="background-image: url(${background}) background-size: cover height: 500px background-position: center"></div>`
          movieInfoPage += `<div class="col-span-3"><p>${movieInfo.title}</p><p>${movieInfo.year}</p><p>${movieInfo.rating}</p><p>${movieInfo.trailer}</p></div>`
          movieInfoPage += `<div class="col-span-9"><p>${movieInfo.overview}</p></div>`
          movieInfoPage += `</div>`

          $('body').append(movieInfoPage)
        })
      })
    })
  }
}

module.exports = Display
