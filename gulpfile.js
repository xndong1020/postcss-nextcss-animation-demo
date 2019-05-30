const gulp = require('gulp')
const webserver = require('gulp-webserver')
const postcss = require('gulp-postcss')
const cssnext = require('postcss-cssnext')
const gutil = require('gulp-util')
const sourcemaps = require('gulp-sourcemaps')
const source = 'process/css/'
const dest = 'builds/nextgen/'
const githubPageDesc = 'docs/'

gulp.task('html', async function() {
  gulp.src(dest + '*.html')
  gulp.src(githubPageDesc + '*.html')
})

/**  generate sourcemap, import css partials with '_' prefix  */
gulp.task('css', async function() {
  gulp
    .src(source + 'style.css')
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        require('postcss-partial-import')({ prefix: '_', extension: '.css' }),
        cssnext()
      ])
    )
    .on('error', gutil.log)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest + 'css'))
    .pipe(gulp.dest(githubPageDesc + 'css'))
})

/**  watch for html and css changes  */
gulp.task('watch', async function() {
  gulp.watch(source + '**/*.css', gulp.series('css'))
  gulp.watch(dest + '**/*.html', gulp.series('html'))
})

/**  dev web server */
gulp.task('webserver', async function() {
  gulp.src(dest).pipe(
    webserver({
      livereload: true,
      port: 3000,
      open: true
    })
  )
})
gulp.task('default', gulp.series('html', 'css', 'webserver', 'watch'))
