'use strict';

const gulp = require("gulp");
const s3 = require("gulp-s3");
const dotenv = require("dotenv");

// load any local secrets in a .env file to process.env
dotenv.load();

var AWS = {
  "key":    process.env.AXIOS_AWS_ACCESS_KEY_ID,
  "secret": process.env.AXIOS_AWS_SECRET_ACCESS_KEY,
  "bucket": "graphics.axios.com",
  "region": "eu-west-2"
}

module.exports = () => {
  // todo: is this the right file path?
  // next steps: run yeoman and try to upload a file to s3
  return gulp.src('./dist/**')
    .pipe(s3(AWS));
}
