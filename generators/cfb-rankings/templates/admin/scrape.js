const axios = require("axios"); // scrapes html
const cheerio = require("cheerio"); // parses html
const fs = require("fs"); // reads/writes files

let output = [];

axios
  .get('https://www.ncaa.com/rankings/football/fbs/associated-press')
  .then((response) => {
      if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const rows = $('table > tbody > tr');

      rows.each((index, elem) => {
        let currRank = $($(elem).find("td")[0]).text();
        if (currRank.toString().includes("T")) {
          currRank = parseInt(currRank.split("-")[1]);
        } else {
          parseInt(currRank)
        }
        let team = $($(elem).find("td")[1]).text();
        let points = $($(elem).find("td")[2]).text()
        let prevRank = $($(elem).find("td")[3]).text() == "NR" ? 0 : parseInt($($(elem).find("td")[3]).text());
        let record = $($(elem).find("td")[4]).text();
        let change = (prevRank == 0) ? "NR" : prevRank - currRank;
        let firstPlace = null;

        if (team.includes("*")) {
          team = team.split("*")[1];
        }

        if (team.includes("(")) {
          firstPlace = parseInt(team.split("(")[1]);
        }

        team = team.split("(")[0].trim();

        let obj = {
          team,
          currRank,
          record,
          prevRank,
          points,
          change,
          firstPlace
        }
        output.push(obj)
      })

      fs.writeFileSync("../src/data/data.json", JSON.stringify(output));
  }
}).catch(function (error) {
    console.log(error);
});