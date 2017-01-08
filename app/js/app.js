const $ = window.$ = window.jQuery = require('jquery')
const Trakt = require('./js/classes/apis/trakt.js')
const Display = require('./js/classes/display.js')
const Pelispedia = require('./js/classes/scrapers/pelispedia.js')
const pelispeida = new Pelispedia()
const trakt = new Trakt()
const display = new Display()
const imagesLoaded = require('imagesloaded')
const trending = trakt.getTrending('movies')
const $body = $('body')

trending.then(() => {
  let bruh = display.getPosters(trending)
  bruh.then(function () {
    let posts = document.querySelectorAll('.poster')
    imagesLoaded(posts, () => {
      console.log('all images have loaded')
      setTimeout(() => {
        $('.sampleContainer').hide(1000)
        $body.css({ overflow: 'visible' })
      }, 1500)
    })
  })
})

$body.on('click', '.movie', (e) => {
  let $this = e.currentTarget
  let title = $($this).data('title')
  let imdbID = $($this).data('imdb')

  $('.sampleContainer').show()

  loadVideo(title, imdbID)
})

let timer
let waitTime = 3000

$body.on('click', '.close', (e) => {
  let $this = e.currentTarget
  $('video').remove()
  $($this).remove()
  $body.css({overflow: 'visible'})
})

$('#filter').change((e) => {
  let _this = e.currentTarget
  let selectedValue = $(_this).val()

  if (selectedValue === 'box-office') {
    let popular = trakt.getMostWatched('movies')
    popular.then(() => {
      console.log(popular)
      display.getPosters(popular)
    })
  } else {
    display.getPosters(trending)
  }
})

$body.on('mousemove', 'video', (e) => {
  let _this = e.currentTarget
  let $close = $('.close')
  if (!$close.is(':visible')) {
    $close.show(1000)
    $(_this).css({ cursor: 'inherit' })
  }
  clearTimeout(timer)
  timer = setTimeout(() => {
    $close.hide(1000)
    $(_this).css({ cursor: 'none' })
  }, waitTime)
})

function loadVideo (title, imdb) {
  let result = pelispeida.getMoviePage(title)

  result.then((sources) => {
    let video = `<video preload="auto" autoplay controls>`
    sources.forEach((url) => {
      video += `<source src="${url}"/>`
    })
    video += `</video>`
    video += `<div class="close"><img src="images/close.svg" width="35" height="35"/></div>`
    $body.append(`${video}`)
    $('.sampleContainer').hide()
    $body.css({
      overflow: 'hidden'
    })
  }).catch((e) => {
    $('.sampleContainer').hide()
    console.log(e)
  })
}

const regex = /var\s+tok\s*=\s*'([^']+)/g;
let str = "var tok    = 'eCNBuxFGpRmFlWjUJjmjguCJI';var token = tok;var baseurl  = 'http://cartoonhd.com';var themeurl = 'http://cartoonhd.com/templates/FliXanity';var viewport = 'desktop';var iframe_ad = false;var iframe_tablet = false;var iframe_mobile = false;var check_valid = false;";

let m;

while ((m = regex.exec(str)) !== null) {
  // This is necessary to avoid infinite loops with zero-width matches
  if (m.index === regex.lastIndex) {
    regex.lastIndex++;
  }

  // The result can be accessed through the `m`-variable.
  m.forEach((match, groupIndex) => {
    console.log(`Found match, group ${groupIndex}: ${match}`);
  });
}