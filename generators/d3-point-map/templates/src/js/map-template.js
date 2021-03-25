import { scalePow } from "d3-scale";
import { select, selectAll } from "d3-selection";
import { geoPath, geoAlbersUsa } from "d3-geo";
import { extent } from "d3-array";

let stateDict = require("../data/fullNameStateDict.json");
let abbvStateDict = require("../data/statesDict.json");
let positionDict = require("../data/statePosition.json");
let topojson = require("topojson-client");

export default class makeMap {
  constructor(opts) {
    Object.assign(this, opts);
    this.aspectHeight = 0.65;

    this.appendElements();
    this.update();
  }

  update() {
    this._setDimensions();
    this._setScales();
    this.render();
  }

  _setDimensions() {
    this.size =
      window.innerWidth <= 450
        ? "mobile"
        : window.innerWidth > 451 && window.innerWidth <= 600
        ? "tablet"
        : "desktop"; // Chris made this, handles map alignment in ways I don't want to mess with
    this.isMobile = window.innerWidth < 600 ? "mobile" : "desktop"; // Needed different breakpoints for state label positioning

    // define width, height and margin
    this.margin = {
      top: this.size === "tablet" ? 50 : 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    this.width =
      this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height =
      this.element.offsetWidth * this.aspectHeight -
      this.margin.top -
      this.margin.bottom;
  }

  _setScales() {
    this.projection = geoAlbersUsa()
      .scale(1)
      .translate([0, 0]);

    this.path = geoPath().projection(this.projection);

    // Stuff chris wrote to center map
    let states = topojson.feature(this.usTopo, this.usTopo.objects.states);
    let b = this.path.bounds(states);

    let bBottom = {
      desktop: 0.23019625629687068,
      tablet: 0.32,
      mobile: 0.23,
    };

    b[1][1] = bBottom[this.size];

    let sMultiply = {
      desktop: 1.05,
      tablet: 1.2,
      mobile: 1.05,
    };

    let s =
      sMultiply[this.size] /
      Math.max(
        (b[1][0] - b[0][0]) / this.width,
        (b[1][1] - b[0][1]) / this.height
      );
    let t = [
      (this.width - s * (b[1][0] + b[0][0])) / 2,
      (this.height - s * (b[1][1] + b[0][1])) / 2,
    ];

    let tOffset = {
      desktop: 40,
      tablet: 30,
      mobile: 40,
    };

    t[0] = t[0] - s / tOffset[this.size]; //Cheat the map to the left

    this.projection.scale(s).translate(t);
  }

  appendElements() {
    this.svg = select(this.element).append("svg");

    this.interactionRect = this.svg
      .append("rect")
      .attr("class", "interaction-rect")
      .style("fill", "white")
      .style("fill-opacity", 0);

    this.plot = this.svg.append("g").attr("class", "chart-g");

    this.states = this.plot
      .append("g")
      .attr("class", "state-g")
      .selectAll(".state")
      .data(
        topojson.feature(this.stateTopo, this.stateTopo.objects.states).features
      )
      .enter()
      .append("path")
      .filter(
        d =>
          d.properties.st != "AS" &&
          d.properties.st != "GU" &&
          d.properties.st != "VI" &&
          d.properties.st != "MP" &&
          d.properties.st != "PR"
      )
      .attr("class", d => `${d.properties.st} state`);

    this.cityContainer = this.plot.append("g").attr("class", "city-container");

    this.cityGroup = this.cityContainer
      .selectAll(".city-group")
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", d => `c-${d.value} ${slugify(d.city)} city-group`);

    this.cityCircle = this.cityGroup
      .append("circle")
      .attr("class", "city-circle");
    /////// selects city names to label ///////
    this.cityText = this.cityGroup
      .append("text")
      .filter(
        d =>
          d.city == "Los Angeles, California" ||
          d.city == "New York, New York" ||
          d.city == "Chicago, Illinois" ||
          d.city == "San Antonio, Texas" ||
          d.city == "Philadelphia, Pennsylvania"
      )
      .text(d => d.city.split(",")[0])
      .attr("class", d => `city-text ${slugify(d.city)}`);
  }

  render() {
    this.svg.attr("width", this.width + this.margin.left + this.margin.right);
    this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

    this.plot.attr(
      "transform",
      `translate(${this.margin.left},${this.margin.top})`
    );
    /////////////////////////////////////////////////////////////
    // States on map
    /////////////////////////////////////////////////////////////
    this.states.attr("d", this.path);

    this.cityGroup.attr("transform", d => {
      // console.log(this.projection([d.long, d.lat]))
      return `translate(${this.projection([d.long, d.lat])[0]},${
        this.projection([d.long, d.lat])[1]
      })`;
    });

    this.cityCircle.attr("cx", 0).attr("cy", 0);

    this.cityText.attr("x", 0).attr("y", -8);
    /////// use this line if you need to arrange something to the front /////
    select(".city-group.chicago-illinois").raise();

    if (this.size == "desktop" || this.size == "tablet") {
      select(".headline").html(
        "100 largest U.S. cities' emissions</br>reduction pledges or commitments, 2017"
      );
    }
    if (this.size == "mobile") {
      select(".headline").html(
        "100 largest U.S. cities' emissions reduction pledges, 2017"
      );
    }
  }
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
