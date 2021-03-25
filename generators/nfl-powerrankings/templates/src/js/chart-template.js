import { select, selectAll } from "d3-selection";
import { max, min } from "d3-array";

export default class makeChart {
  constructor(opts) {
    Object.assign(this, opts);
    this.setData();
    this.appendElements();
    this.update();
  }

  setData() {

    this.currWeek.forEach(currTeam => {

      let pastResult = this.prevWeek.filter((prevTeam) => { // Get the team's past ranking
        return prevTeam.team === currTeam.team
      })[0]

      currTeam.change = currTeam.rank - pastResult.rank;
    })
  }

  update() {
    this.render();
  }

  appendElements() {
    this.container = select(this.element);

    this.table = this.container
      .append("div")
      .attr("class", "table");

    this.row = this.table.selectAll("row")
      .data(this.currWeek)
      .enter()
      .append("tr")
      .attr("class", "row")

    this.team = this.row.append("td")
      .attr("class", "rank")
      .text(d=> d.rank);

    this.logoTd = this.row.append("td")
      .attr("class", "logo");

    this.logo = this.logoTd.append("img")
      .attr("height", "22px")
      .attr("width", "22px")
      .attr("src", d=> "./img/" + slugify(d.team) + ".png");

    this.teamTd = this.row.append("td")
      .attr("class", "team")

    this.team = this.teamTd.append("span")
      .attr("class", "team-name")
      .text(d=> d.team);

    this.record = this.teamTd.append("span")
      .attr("class", "record")
      .text(d=> "(" + d.record + ")");

    this.trend = this.row.append("td")
      .attr("class", d=> {
        if (d.change < 0) {
          return "trend up"
        } else if (d.change > 0) {
          return "trend down"
        } else {
          return "trend no-change"
        }
      })

    this.trendArrow = this.trend.append("img")
      .attr("width", "12px")
      .attr("src", d=> {
        if (d.change < 0) {
          return "./img/arrow-up.png"
        } else if (d.change > 0) {
          return "./img/arrow-down.png"
        } else {
          return " "
        }
      });

    this.trendText = this.trend.append("span")
      .text(d=> {
        return change(d.change);
      });

  }

  render() {
  }
}

function change(text) {
  if (text == 0) {
    return "–";
  } else if (text > 0) {
    return text;
  } else {
    let number = text.toString().slice(1);
    return number
  }
}

function slugify(text) {
  return text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
  .replace(/^-+/, '')             // Trim - from start of text
  .replace(/-+$/, '');            // Trim - from end of text
}
