import { select, selectAll } from "d3-selection";

let teamDict = require("../data/teamDict.json")

export default class makeChart {
  constructor(opts) {
    Object.assign(this, opts);

    console.table(this.data)

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
      .text(d=> d.position);

    this.logoTd = this.row.append("td")
      .attr("class", "logo");

    this.logo = this.logoTd.append("img")
      .attr("height", "22px")
      .attr("width", "22px")
      .attr("src", d=> "./img/" + slugify(teamDict[d.team]) + ".png");

    this.team = this.row.append("td")
      .attr("class", "team")
      .html(d=> teamDict[d.team]);

    this.points = this.row.append("td")
      .attr("class", "points")
      .text(d=> d.points);

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