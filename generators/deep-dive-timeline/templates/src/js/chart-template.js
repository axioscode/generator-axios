import { axisBottom, axisRight } from "d3-axis";
import { scaleBand, scaleLinear } from "d3-scale";
import { select } from "d3-selection";

export default class makeChart {
  constructor(opts) {
      Object.assign(this, opts);
      this.aspectHeight = opts.aspectHeight ? opts.aspectHeight : 0.78;

      this.timelineData = require('data/data.json')

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
    this.series = []

    Object.keys(this.timelineData).forEach(rowNum => {
      let dataEntry = this.timelineData[rowNum];

      let obj = {
        code: rowNum,
        year: dataEntry.year,
        type: dataEntry.type,
        text: dataEntry.text,
        illo: dataEntry.illo_filename,
        yNudge: parseInt(dataEntry.y_nudge)
      }

      this.series.push(obj)
    })
  }
  _setDimensions() {
      this.margin = {
          top: 0,
          right: 10,
          bottom: 0,
          left: 10,
      };

      this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
      this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;
  }

  _setScales() {
    let yValsArray = []
    for (let i = 0; i <= this.timelineData.length; i++) {
      yValsArray.push(i)
    }
    this.xScale = scaleLinear()
      .rangeRound([0, this.width])
      .domain([-12,12]);

    this.yScale = scaleBand()
      .paddingInner(0.1) // edit the inner padding value in [0,1]
      .paddingOuter(0) // edit the outer padding value in [0,1]
      .rangeRound([this.height, 0])
      .domain(yValsArray);
  }

  appendElements() {
    this.svg = select(this.element).append("svg");
    this.plot = this.svg.append("g").attr("class", "chart-g");
    this.xAxis = this.plot.append("g").classed("axis x-axis", true);
    this.yAxis = this.plot.append("g").classed("axis y-axis", true);

    this.events = this.plot.append("g").attr("class", "timeline-container")
      .selectAll("g")
      .data(this.series)
      .enter().append("g")
      .attr("class", d=> "event-group-" + d.code)

    this.eventDot = this.events.append("circle")
      .attr("class", d => {
        if (d.code % 2 == 0){
          return "dot right-side "  + d.type
        }else{
          return "dot left-side " + d.type
        }
      })
      

    this.textGroup = select(".chart").selectAll(".text-group")
      .data(this.series)
      .enter().append("div")
      .attr("class", d => {
        if (d.code % 2 == 0){
          return "text-group right-side " + "year-" + d.year
        }else{
          return "text-group left-side " + "year-" + d.year
        }
      })

    this.textGroup.append("span")
      .attr("class", d=> "year-text " + d.type)
      .html(d => d.year + "<br>");

    this.textGroup.append("span")
      .attr("class", d=> "blurb-text")
      .html(d => d.text);

    this.textGroup.append("img")
      .attr("class", d=>{
        if(d.illo != "none"){
          return "mini-illo " + "year-" + d.year
        }else{
          return "no-mini-illo"
        }
      })
      .attr("src", d=>{
        if(d.illo != "none"){
          return "./img/" + d.illo
        }
      })
      .attr('width', "300px")
      .attr('height', "160px")


    this.line = this.plot.append("line")
        .attr("class", "zero-line");
  }

  render() {
      this.ww = window.innerWidth;
      this.svg.attr("width", this.width + this.margin.left + this.margin.right);
      this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

      this.plot.attr(
          "transform",
          `translate(${this.margin.left},${this.margin.top})`
      );

      this.xAxis
          .attr("transform", "translate(0," + (this.height + 20) + ")")
          .call(
              axisBottom(this.xScale)
                  .tickSize(-this.height - 20)
                  .tickValues([])
          );

      this.yAxis
        .attr("transform", "translate(" + this.width + "," + 10 + ")")
        .call(axisRight(this.yScale)
            .tickSize(0)
            .tickValues([]));

      this.eventDot.attr("r", ()=>{
        if(this.ww <= 500){
          return 6;
        }else{
          return 8;
        }
      })

      this.events.attr("transform", d => {
          let x = this.xScale(0); 
          let y = this.yScale(parseInt(d.code)) + d.yNudge;
          return `translate(${x}, ${y})`;
      })

      this.textGroup
        .style("left", d=>{
          if (d.code % 2 == 0){
            if(d.year == 2018){
              return this.xScale(-4) + "px"
            }else{
              return this.xScale(1) + "px"
            }
          }
        })
        .style("right", d=>{
          if (d.code % 2 != 0){
            return this.xScale(1) + "px"
          }
        })
        .style("top", d=> {
          if(d.year == 2018){
            return this.yScale(parseInt(d.code)) + 10 + "px"
          }else{
            return this.yScale(parseInt(d.code)) + d.yNudge - 10 + "px"
          }
        })
      
      this.line
        .attr("x1", this.xScale(0))
        .attr("x2", this.xScale(0))
        .attr("y1", this.yScale(0))
        .attr("y2", this.yScale(20))

      this.line.lower()
  }
}

function makeSlug(x) {
  return x.toString().toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
}