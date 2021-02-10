import { select, selectAll } from "d3-selection";

export default class makeChart {
  constructor(opts) {
    Object.assign(this, opts);

    this.data.forEach(d=> {
      d.team = (d.team.includes("State")) ? d.team.replace("State", "St.") : d.team
      if (d.team == "North Carolina St.") {
        d.team = "NC St."
      }
      if (d.team == "Connecticut") {
        d.team = "UConn"
      }
      if (d.team == "South Carolina") {
        d.team = "S. Carolina"
      }
      if (d.team == "South Dakota St.") {
        d.team = "S. Dakota St."
      }
      if (d.team == "Southern California") {
        d.team = "USC"
      }
    });

    this.appendElements();
    this.update();
  }

  update() {
    this._setDimensions();
    this._setScales();
    this.render();
  }

  _setDimensions() {
    // define width, height and margin
    this.margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    };

    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;
  }

  _setScales() {

  }

  appendElements() {
    this.container = select(this.element);

    this.table = this.container
      .append("div")
      .attr("class", "table");

    this.row = this.table.selectAll("row")
      .data(this.data)
      .enter()
      .append("tr")
      .attr("class", "row")

    this.rank = this.row.append("td")
      .attr("class", "rank")
      .text(d=> d.currRank);

    this.logoTd = this.row.append("td")
      .attr("class", "logo");

    this.logo = this.logoTd.append("img")
      .attr("height", "22px")
      .attr("width", "22px")
      .attr("src", d=> "./img/" + slugify(d.team) + ".png");

    this.team = this.row.append("td")
      .attr("class", "team")
      .html(d=> {
        if (d.firstPlace > 0) {
          return `${d.team} <span class="first-place">(${d.firstPlace})</span>`
        } else {
          return d.team
        }
      });

    this.record = this.row.append("td")
      .attr("class", "record")
      .text(d=> {
        return d.record.split(")")[0];
      });

    this.points = this.row.append("td")
      .attr("class", "points")
      .text(d=> d.points);

    this.trend = this.row.append("td")
      .attr("class", d=> {
        if (d.change > 0) {
          return "trend up"
        } else if (d.change < 0) {
          return "trend down"
        } else {
          return "trend no-change"
        }
      })


    this.trendArrow = this.trend.append("img")
      .attr("width", "12px")
      .attr("src", d=> {
        if (d.change > 0) {
          return "./img/arrow-up.png"
        } else if (d.change < 0) {
          return "./img/arrow-down.png"
        } else {
          return ""
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
    return "-"
  } else if (text == "NR") {
    return "NR"
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