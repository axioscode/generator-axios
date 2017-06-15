'use strict';

const gulp = require('gulp');
const debug = require('gulp-debug');
const prompt = require('gulp-prompt');

const config = require('./config');
const fs = require('fs');

var projectConfig = require('./../project.config.json');

// Add File
var addFile = function() {
  return gulp.src(config.paths.projectConfig)
    .pipe(prompt.prompt([
      {
        type: "list",
        name: "type",
        message: "What type of document are you adding from Google Drive?",
        choices: [
          {"name": "Document (ArchieML)", "value": "doc"},
          {"name": "Spreadsheet", "value": "sheet"}
        ]
      },{
        type: "list",
        name: "opts",
        message: "Which processor do you want to use on the spreadsheet?",
        choices: [
          {"name": "Key/Value", "value": {"processor": "keyvalue"}},
          {"name": "Table", "value": {"processor": "table"}}
        ],
        when: function(ans) { return ans.type === "sheet"; }
      },{
        type: 'input',
        name: 'fileId',
        message: 'What is your douments fileId?'
      },{
        type: 'input',
        name: 'name',
        message: 'What name do you want to save this file with?'
      }], function(res) {
        if ('files' in projectConfig) {
          projectConfig.files.push(res);
        } else {
          projectConfig.files = [res];
        }
        fs.writeFile(config.paths.projectConfig, JSON.stringify(projectConfig, null, 2), function (err) {
          if (err) return console.log(err);
          console.log('Adding ' + res.fileId  + " to project.config.json");
        });
    }));
}

module.exports = {
  addFile: addFile,
  fetch: require('./fetch/get-data'),
}
