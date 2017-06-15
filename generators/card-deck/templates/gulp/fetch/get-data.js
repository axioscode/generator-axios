'use strict'

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

const config = require('../../project.config')
const gulpConfig = require('../../gulp/config')
const fetch = require('./fetch')
const htmlToArchieML = require('./html-to-archieml')
const xlsxToCopyText = require('./xlsx-to-copytext')

function logDownload (fileName, fileId, color) {
  console.log(chalk[color](`Downloaded \`${fileName}\` (${fileId})`))
}

module.exports = () => {
  fetch(config.files, (err, data, file) => {
    if (err) throw err

    const filePath = path.join(gulpConfig.dirs.src.data, `${file.name}.json`)

    if (file.type === 'doc') {
      htmlToArchieML(data, (err, d) => {
        if (err) throw err
        fs.writeFileSync(filePath, JSON.stringify(d, null, 2))
        logDownload(file.name, file.fileId, 'magenta')
      })
    }

    if (file.type === 'sheet') {
      xlsxToCopyText(data, file.opts, (err, d) => {
        if (err) throw err
        fs.writeFileSync(filePath, JSON.stringify(d, null, 2))
        logDownload(file.name, file.fileId, 'cyan')
      })
    }
  })
}
