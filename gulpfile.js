var gulp = require('gulp')
var sass = require('gulp-sass')
var watch = require('gulp-watch')
var batch = require('gulp-batch')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')

var paths = {
  scss: 'src/scss/**/*.scss'
}

gulp.task('sass', function () {
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(rename('default.css'))
    .pipe(gulp.dest('./app/css/'))
})

gulp.task('default', function () {
  // Call Once
  gulp.start('sass')

  // Watch
  watch(paths.scss, batch(function (events, done) {
    gulp.start('sass', done)
  }))
})
