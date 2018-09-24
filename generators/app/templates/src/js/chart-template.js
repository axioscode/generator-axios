import {
  axisBottom,
  axisLeft
} from "d3-axis";
import {
  scaleLinear
} from "d3-scale";
import {
  select
} from "d3-selection";

export default class makeChart {
  constructor(opts) {
    Object.assign(this, opts);
    this.aspectHeight = opts.aspectHeight ? opts.aspectHeight : 0.68;
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
      right: 30,
      bottom: 50,
      left: 50,
    };

    this.width =
      this.element.offsetWidth - this.margin.left - this.margin.right;
    //Determine desired height here
    this.height =
      this.element.offsetWidth * this.aspectHeight -
      this.margin.top -
      this.margin.bottom;
  }

  _setScales() {
    this.xScale = scaleLinear()
      .rangeRound([0, this.width])
      .domain([0, 100]);

    this.yScale = scaleLinear()
      .rangeRound([this.height, 0])
      .domain([0, 100]);
  }

  appendElements() {
    this.svg = select(this.element).append("svg");

    this.plot = this.svg.append("g").attr("class", "chart-g");

    this.xAxis = this.plot.append("g").classed("axis x-axis", true);

    this.yAxis = this.plot.append("g").classed("axis y-axis", true);
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
      .call(axisBottom(this.xScale).tickSize(-this.height - 20));

    this.yAxis
      .attr("transform", "translate(" + -20 + ",0)")
      .call(axisLeft(this.yScale).tickSize(-this.width - 20));
  }
}
