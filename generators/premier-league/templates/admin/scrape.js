const cheerio = require("cheerio"); // parses html
const fs = require("fs"); // reads/writes files
const axios = require("axios"); // reads/writes files

axios.get('https://www.premierleague.com/tables')
  .then((response) => {
      if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      let output = [];

      const rows = $('table > tbody.isPL > tr');

      rows.each((i, elem) => {
        let position = $($(elem).find("td.pos .value")[0]).text();
        let team = $($(elem).find("td.team .long")[0]).text();
        let points = $($(elem).find("td.points")[0]).text();

        if (team != "") {
          let obj = {
            team,
            position,
            points,
          }
          output.push(obj)
        }
      });

      fs.writeFileSync("../src/data/data.json", JSON.stringify(output));
  }
}, (error) => console.log(error) );