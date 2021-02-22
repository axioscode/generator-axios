import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleTime } from "d3-scale";
import { select, selectAll } from "d3-selection";
import { line } from "d3-shape";
import { nest } from "d3-collection";
import { sum, extent } from "d3-array";
import { timeParse, timeFormat } from "d3-time-format";


export default class makeChart {
  constructor(opts) {
    Object.assign(this, opts);

    this.parser = timeParse("%Y-%m-%d");
    this.size = window.innerWidth <= 500 ? "mobile" : "desktop";
    this.xVals = this.size == "mobile" ? [this.parser("2020-04-01"),this.parser("2020-07-01"), this.parser("2020-10-01"), this.parser("2021-01-01")] : [this.parser("2020-03-01"),this.parser("2020-05-01"), this.parser("2020-07-01"), this.parser("2020-09-01"), this.parser("2020-11-01"), this.parser("2021-01-01")];

    this._setData();
    this.appendElements();
    this.update();
  }

  update() {
    this._setDimensions();
    this._setScales();
    this.render();
  }

  _setData() {
    this.flattenedData = []
    for (var key in this.data) {
      this.data[key].data.forEach(entry =>{
        this.flattenedData.push({
          continent: this.data[key].continent,
          country: this.data[key].location,
          date: entry.date,
          newCases: entry.new_cases,
        })
      })
    }
    this.datetimeExtent = extent(this.flattenedData, d => d.date)

    // take out any "undefined" continents
    var continents = ["North America", "South America", "Europe", "Asia", "Africa", "Oceania"]
    this.filteredData = this.flattenedData.filter(d => {
      return continents.includes(d.continent)
    })

    this.filteredData.sort((a,b) =>{
      return this.parser(a.date) - this.parser(b.date)
    })

    this.dateTrimmed = this.filteredData.filter(d =>{
      return this.parser(d.date) > this.parser("2020-02-01")
    })

    this.linesData = nest()
      .key(function(d) { return d.continent; })
      .key(function(d) { return d.date; })
      .rollup(function(v) { return sum(v, function(d) { return d.newCases; }); })
      .entries(this.dateTrimmed);

    this.annoPositions =[];
    this.linesData.forEach(continentEntry =>{
      let i = continentEntry.values.length - 1;
      this.annoPositions.push({
        continent: continentEntry.key,
        date: continentEntry.values[i].key,
        lastValue: (continentEntry.values[i].value + continentEntry.values[i-1].value + continentEntry.values[i-2].value + continentEntry.values[i-3].value + continentEntry.values[i-4].value + continentEntry.values[i-5].value + continentEntry.values[i-6].value)/ 7
      })
    })
  }

  _setDimensions() {
    this.margin = {
      top: 20,
      right: this.size === "desktop" ? 175 : 130,
      bottom: 45,
      left: this.size === "desktop" ? 53 : 51
    };

    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;
  }

  _setScales() {
    this.xScale = scaleTime()
      .rangeRound([0, this.width])
      .domain([this.parser("2020-02-01"), this.parser(this.datetimeExtent[1])]);

    this.yScale = scaleLinear()
      .range([this.height, 0])
      .domain([0, 300000]);

    // chart 7 day moving average
    this.lineGenerator = line()
      .x(d => this.xScale(this.parser(d.key)))
      .y((d,i,e) => {
        if(i > 6){
          return this.yScale((e[i].value + e[i-1].value + e[i-2].value + e[i-3].value + e[i-4].value + e[i-5].value + e[i-6].value)/ 7)
        }else{
          return this.yScale(0)
        }
      })
  }

  appendElements() {
    this.svg = select(this.element).append("svg");
    this.plot = this.svg.append("g").attr("class", "chart-g");

    this.xAxis = this.plot.append("g").classed("axis x-axis", true);
    this.yAxis = this.plot.append("g").classed("axis y-axis", true);

    this.lines = this.plot.selectAll(".line")
      .data(this.linesData, d => d.key)
      .enter().append("path")
      .attr("class", d => "line " + slugify(d.key));

    this.dots = this.plot.selectAll(".dot")
      .data(this.annoPositions)
      .enter()
      .append("circle").attr('class', d => "dot " + slugify(d.continent))
      .attr("r", 4);

    this.annoContainer = this.plot.selectAll(".anno")
      .data(this.annoPositions)
      .enter().append("g")
      .attr("class", d => "anno " + slugify(d.continent) + " annotation");

    this.continentLabel = this.annoContainer.append("text")
      .attr("class", "continent")

    this.casesLabel = this.annoContainer.append("text")
      .attr("class", "cases")
      .text(d => formatNumber(d.lastValue));

    // Note, hacky adding of years to x-axis
    this.xAxisYears = this.plot.selectAll(".x-axis-years")
      .data([this.xVals[0], this.xVals[this.xVals.length-1]])
      .enter()
      .append("text")
      .text(d=> {
        let yearString = d.toString().split(" ")[3].substring(2)
        return "`" + yearString
      })
      .attr("class", "x-axis-years");
  }

  render() {
    this.svg.attr("width", this.width + this.margin.left + this.margin.right);
    this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

    this.plot.attr(
      "transform",
      `translate(${this.margin.left},${this.margin.top})`
    );

    this.xAxis
      .attr("transform", "translate(0," + (this.height) + ")")
      .call(
        axisBottom(this.xScale)
          .tickSize(20)
          .tickValues(this.xVals)
          .tickFormat(d =>formatDateString(d))
      );

    this.yAxis
      .attr("transform", "translate(" + (-20) + ",0)")
      .call(
        axisLeft(this.yScale)
          .tickSize(-this.width - 20)
          .tickValues([0, 100000, 200000, 300000])
          .tickFormat(d => {
            if (d >= 1000) {
              return (d / 1000) + 'k';
            } else {
              return d
            }
          })
      );

    this.lines
      .attr("d", d => {
        return this.lineGenerator(d.values)
      })

    this.dots
      .attr("cx", d => this.xScale(this.parser(d.date)))
      .attr("cy", d =>  this.yScale(d.lastValue));

    this.continentLabel
      .text(d => {
        if (this.size == "mobile" && d.continent == "North America") {
          return "N. America"
        } else if (this.size == "mobile" && d.continent == "South America") {
          return "S. America"
        } else {
          return d.continent
        }
      })
      .attr("y", d => this.yScale(d.lastValue) + 6)
      .attr("x", this.width + 8)

    this.casesLabel
      .attr("y", d => this.yScale(d.lastValue) + 6)
      .attr("x", this.size == "desktop" ? this.width + 125 : this.width + 85)

    this.xAxisYears
      .attr("x", d=> this.xScale(d) - 3)
      .attr("y", this.height + this.margin.bottom)

    selectAll(".x-axis .tick text")
      .attr("dx", d=> {
        return formatDateString(d).includes(".") ? 3 : 0
      })

    let headlineText = this.size == "desktop" ? "Daily reported COVID-19 cases, by continent" : "Daily reported COVID-19</br>cases, by continent"
    select(".headline").html(headlineText)
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

function formatNumber(val) {
  if(val > 1000000){
      return (val / 1000000).toFixed(1) + 'm'
  }else if(val >1000){
      return (val / 1000).toFixed(1) + 'k'
  }else{
      return val.toFixed(0)
  }
}
function formatDateString(dateString){
  const string = dateString.toString();
  const beforeTime = string.split("00:")[0];
  const split = beforeTime.split(" ");
  const yyyy = split[3];
  const mm = split[1];
  const dd = split[2];
  const day = dd.slice(0,1) == 0 ? dd.slice(1,2) : dd

  const months = {"Jan":"Jan.", "Feb":"Feb.", "Mar":"March", "Apr":"April", "May":"May", "Jun":"June", "Jul":"July", "Aug":"Aug.", "Sep":"Sept.", "Oct":"Oct.", "Nov":"Nov.", "Dec":"Dec."};
  const monthAbbr = months[mm];

  return monthAbbr;
}