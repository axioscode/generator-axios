import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear, scaleBand } from "d3-scale";
import { select, selectAll } from "d3-selection";
import { timeParse } from "d3-time-format";
import { sum } from "d3-array";

export default class makeChart {
  constructor(opts) {
    Object.assign(this, opts);

    this.parseTime = timeParse("%y-%m-%d");
    this.data.sort((a,b)=> b.DATE - a.DATE);
    this.data.forEach(d=> {
      let string = d.DATE.split("/");
      let month = string[0];
      let day = string[1];
      let year = string[2];

      d.date = d.DATE;
      d.claims = d.ICSA;

      d.date = this.parseTime(`${year}-${month}-${day}`);
      return d
    })
    this.data = this.data.filter(d=> d.date >= new Date(2000,0,1));

    this.isMobile = window.innerWidth >= 599 ? false : true;
    this.theWeekTheWorldChanged = new Date (2020,2,21);
    this.crisisRangeData = this.data.filter(d=> d.date >= this.theWeekTheWorldChanged);

    this.crisisWidth = 4 * this.crisisRangeData.length;

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
      top: 30,
      right: this.isMobile ? 68 : 79,
      bottom: 35,
      left: this.isMobile ? 35 : 38,
    };

    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    //Determine desired height here
    this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;
  }

  _setScales() {

    this.xDom = this.data.map(d=> d.date);
    this.xDomHistorical = this.xDom.filter(d=> d < this.theWeekTheWorldChanged);
    this.xDomNew = this.xDom.filter(d=> d >= this.theWeekTheWorldChanged);

    this.xHistoricalScale = scaleBand()
      .range([0, this.width - this.crisisWidth])
      .domain(this.xDomHistorical)
      .padding(0);

    this.xNewScale = scaleBand()
      .range([this.width - this.crisisWidth, this.width])
      .domain(this.xDomNew)
      .padding(0.3);

    this.yScale = scaleLinear()
      .rangeRound([this.height, 0])
      .domain([0, 7000000]);
  }

  appendElements() {
    this.svg = select(this.element).append("svg");

    this.plot = this.svg.append("g").attr("class", "chart-g");

    this.xAxis = this.plot.append("g").classed("axis x-axis", true);

    this.yAxis = this.plot.append("g").classed("axis y-axis", true);

    this.bars = this.plot.append("g").attr("class", "bar-container")
      .selectAll(".bar")
      .data(this.data.filter(d=> d.date < this.theWeekTheWorldChanged))
      .enter()
      .append("rect")
      .attr("class", "bar")

    this.totalClaims = (sum(this.crisisRangeData, d=> d.claims) / 1000000).toFixed(1) + "m";
    this.lastDate = formatDateString(this.crisisRangeData[this.crisisRangeData.length-1].date).split(",")[0];

    this.historicalLabel = this.plot.append("text")
      .text("Pre-COVID claims")
      .attr("class", "tertiary-label historical")

    this.lastWeekLabelTop = this.plot.append("text")
      .text("Week ending")
      .attr("class", "tertiary-label")

    this.lastWeekLabelBottom = this.plot.append("text")
      .text(`on ${this.lastDate}`)
      .attr("class", "tertiary-label")

    this.lastWeekValue = this.plot.append("text")
      .text((this.crisisRangeData[this.crisisRangeData.length-1].claims / 1000000).toFixed(1) + "m")
      .attr("class", "annotation--number")

    this.lastWeekLine = this.plot.append("line")
      .attr("class", "last-week-line")

    this.newBars = this.plot.append("g").attr("class", "new-bar-container")
      .selectAll(".bar-new")
      .data(this.data.filter(d=> d.date >= this.theWeekTheWorldChanged))
      .enter()
      .append("rect")
      .attr("class", "bar-new")
  }

  render() {
    this.svg.attr("width", this.width + this.margin.left + this.margin.right);
    this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

    this.plot.attr(
      "transform",
      `translate(${this.margin.left},${this.margin.top})`
    );

    this.xAxis
      .attr("transform", "translate(0," + (this.height + 20) + ")")
      .call(axisBottom(this.xHistoricalScale)
        .tickSize(-20)
        .tickValues([new Date(2000,0,1), new Date(2005,0,1), new Date(2010,0,2), new Date(2015,0,3), new Date(2020,0,4)])
        .tickFormat(d=> formatYear(d))
      );
    selectAll(".axis.x-axis text").attr("dx", -3)

    this.yAxis
      .attr("transform", "translate(" + -20 + ",0)")
      .call(axisLeft(this.yScale)
        .tickSize(-this.width - 20)
        .tickValues([0,1000000,2000000,3000000,4000000,5000000,6000000,7000000])
        .tickFormat(d=> {
          if (d === 0) {
            return 0
          } else {
            return d/1000000 + "m"
          }
        })
      );

    this.bars
      .attr("x", d=> this.xHistoricalScale(d.date))
      .attr("y", d=> this.yScale(d.claims))
      .attr("width", this.xHistoricalScale.bandwidth())
      .attr("height", d=> this.height - this.yScale(d.claims))

    this.newBars
      .attr("x", d=> this.xNewScale(d.date))
      .attr("y", d=> this.yScale(d.claims))
      .attr("width", this.xNewScale.bandwidth())
      .attr("height", d=> this.height - this.yScale(d.claims))

    this.historicalLabel
      .attr("x", (this.width - (this.crisisWidth))/2)
      .attr("y", this.height - 35)
      .style("text-anchor", "middle")

    this.lastWeekLabelTop
      .attr("x", d=> this.xNewScale(this.crisisRangeData[this.crisisRangeData.length-1].date))
      .attr("y", d=> this.yScale(this.crisisRangeData[this.crisisRangeData.length-1].claims) - 55)
      .style("text-anchor", "start")

    this.lastWeekLabelBottom
      .attr("x", d=> this.xNewScale(this.crisisRangeData[this.crisisRangeData.length-1].date))
      .attr("y", d=> this.yScale(this.crisisRangeData[this.crisisRangeData.length-1].claims) - 37)
      .style("text-anchor", "start")

    this.lastWeekValue
      .attr("x", d=> this.xNewScale(this.crisisRangeData[this.crisisRangeData.length-1].date))
      .attr("y", d=> this.yScale(this.crisisRangeData[this.crisisRangeData.length-1].claims) - 17)
      .style("text-anchor", "start")

    this.lastWeekLine
      .attr("x1", this.xNewScale(this.crisisRangeData[this.crisisRangeData.length-1].date) + this.xNewScale.bandwidth()/2)
      .attr("y1", d=> this.yScale(this.crisisRangeData[this.crisisRangeData.length-1].claims) - 2)
      .attr("x2", this.xNewScale(this.crisisRangeData[this.crisisRangeData.length-1].date) + this.xNewScale.bandwidth()/2)
      .attr("y2", d=> this.yScale(this.crisisRangeData[this.crisisRangeData.length-1].claims) - 14)


    select(".first-date").text(formatDateString(this.data[0]["date"]));
    select(".last-date").text(formatDateString(this.data[this.data.length-1]["date"]));
  }
}

function formatDateString(dateString) {
  const string = dateString.toString();
  const beforeTime = string.split("00:")[0];
  const split = beforeTime.split(" ");
  const yyyy = split[3];
  const mm = split[1];
  const dd = split[2];
  const day = dd.slice(0,1) == 0 ? dd.slice(1,2) : dd

  const months = {"Jan":"Jan.", "Feb":"Feb.", "Mar":"March", "Apr":"April", "May":"May", "Jun":"June", "Jul":"July", "Aug":"Aug.", "Sep":"Sept.", "Oct":"Oct.", "Nov":"Nov.", "Dec":"Dec."};
  const monthAbbr = months[mm];

  return monthAbbr + " " + day + ", " + yyyy;
}

function formatYear(dateString) {
  const string = dateString.toString();
  const beforeTime = string.split("00:")[0];
  const split = beforeTime.split(" ");
  const yyyy = split[3];
  const yy = yyyy.slice(2)

  return "`" + yy;
}
