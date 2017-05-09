const path = require('path');

const gulp = require('gulp')
const cachebust = require('gulp-cache-bust')

const config = require('./config')

module.exports = () => {
  return gulp.src(path.join(config.dirs.dist, '**/*.html'))
    .pipe(cachebust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest(config.dirs.dist));
}

