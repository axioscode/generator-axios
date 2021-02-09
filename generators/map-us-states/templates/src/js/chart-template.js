import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select, selectAll } from "d3-selection";
import { geoPath, geoAlbersUsa } from "d3-geo";

let stateDict = require("../data/fullNameStateDict.json");
let abbvStateDict = require("../data/twoLetterStateDict.json");
let positionDict = require("../data/statePosition.json");
let topojson = require("topojson-client");
import Tooltip from './tooltipFactory.js';

export default class makeChart {
  constructor(opts) {
    Object.assign(this, opts);
    this.aspectHeight = .65;

    // DC and Puerto Rico data
    this.PRDCdata = this.stateTopo.objects.states.geometries.filter(d=> d.properties.st == "PR" || d.properties.st == "DC");

    this.appendElements();
    this.update();

    this.theTooltip = new Tooltip({
      'parent' : '.chart-container',
      'formats': {
        'none' : d => d,
        'state' : d => abbvStateDict[d][0]
      }
    })
  }

  update() {
    this._setDimensions();
    this._setScales();
    this.render();
  }

  _setDimensions() {
    this.size = window.innerWidth <= 420 ? "mobile" : window.innerWidth > 421 && window.innerWidth <= 599 ? "tablet" : "desktop"; // Chris made this, handles map alignment in ways I don't want to mess with
    this.isMobile = window.innerWidth < 600 ? "mobile" : "desktop"; // Needed different breakpoints for state label positioning

    // define width, height and margin
    this.margin = {
      top: this.size === "tablet" ? 50 : 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.element.offsetWidth * this.aspectHeight - this.margin.top - this.margin.bottom;
  }

  _setScales() {
    this.projection = geoAlbersUsa()
      .scale(1)
      .translate([0, 0]);

    this.path = geoPath()
      .projection(this.projection);

    // Stuff chris wrote to center map
    let states = topojson.feature(this.stateTopo, this.stateTopo.objects.states);
    let b = this.path.bounds(states);

    let bBottom = {
      desktop: 0.23019625629687068,
      tablet: .32,
      mobile: .23
    }

    b[1][1] = bBottom[this.size];

    let sMultiply = {
      desktop: 1.05,
      tablet: 1.2,
      mobile: 1.05
    }

    let s = sMultiply[this.size] / Math.max((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1]) / this.height);
    let t = [(this.width - s * (b[1][0] + b[0][0])) / 2, (this.height - s * (b[1][1] + b[0][1])) / 2];

    let tOffset = {
      desktop: 28,
      tablet: 30,
      mobile: 40
    }

    t[0] = t[0] - (s / tOffset[this.size]); //Cheat the map to the left

    this.projection.scale(s).translate(t);
  }

  appendElements() {
    this.svg = select(this.element).append("svg");

    this.plot = this.svg.append("g").attr("class", "chart-g");

    /////////////////////////////////////////////////////////////
    // U.S. states, borders, and labels
    /////////////////////////////////////////////////////////////
    this.states = this.plot.append("g")
      .attr("class", "state-g")
      .selectAll(".state")
      .data(topojson.feature(this.stateTopo, this.stateTopo.objects.states).features)
      .enter().append("path")
      .filter(d=> d.properties.st != "AS" && d.properties.st != "GU" && d.properties.st != "VI" && d.properties.st != "MP" && d.properties.st != "PR")
      .attr("class", d=> d.properties.st + " state");

    this.stateBorders = this.plot.append("path")
      .attr("class", "state-borders")

    // Optional border outlining the U.S.
    // this.usBorder = this.plot.append("path")
    //   .attr("class", "us-border")

    this.stateLabelContainer = this.plot.append("g")
      .attr("class", "state-label-countainer")

    this.stateLabelGroup = this.stateLabelContainer.selectAll("g.state-label-group")
      .data(topojson.feature(this.stateTopo, this.stateTopo.objects.states).features)
      .enter()
      .append("g")
      .filter(d=> d.properties.st != "AS" && d.properties.st != "GU" && d.properties.st != "VI" && d.properties.st != "MP" && d.properties.st != "PR")
      .attr("class", d => d.properties.st + " state-label-group");

    this.stateLabelName = this.stateLabelGroup.append("text")
      .attr('class', "state-annotation");

    /////////////////////////////////////////////////////////////
    // Tiles for DC and PR
    /////////////////////////////////////////////////////////////
    this.mapTiles = this.plot.selectAll(".state.tiles")
      .data(this.PRDCdata)
      .enter()
      .append("rect")
      .attr("class", d=> d.properties.st + " state tiles");

    this.mapTileLabelGroup = this.plot.selectAll("g.state-label-group.tiles")
      .data(this.PRDCdata)
      .enter()
      .append("g")
      .attr("class", d => d.properties.st + " state-label-group tiles");

    this.mapTileLabelName = this.mapTileLabelGroup.append("text")
      .attr('class', "state-annotation");
  }

  render() {
    this.svg.attr("width", this.width + this.margin.left + this.margin.right);
    this.svg.attr("height", this.height + this.margin.top + this.margin.bottom);

    this.plot.attr(
      "transform",
      `translate(${this.margin.left},${this.margin.top})`
    );

  /////////////////////////////////////////////////////////////
  // States on map, and what happens on hover/tap
  /////////////////////////////////////////////////////////////
  this.states
    .attr("d", this.path)
    .on('mouseover', (d,i,e) =>{
      let stateClass = d.properties.st;
      select(`.state.${stateClass}`).classed('is-active', true).raise();
      select(".chart-container").classed('tooltip-active', true);

      let bbox = document.querySelector(`.state.${stateClass}`).getBoundingClientRect();

      let coords = [
        bbox.x + bbox.width - bbox.width/2,
        bbox.y + bbox.height - bbox.height/2
      ];

      let w = this.width + this.margin.left + this.margin.right;
      let h = this.height + this.margin.top + this.margin.bottom;
      this.theTooltip.position(d.properties,coords,[w,h])
    })
    .on('mouseleave', (d,i,e) =>{
      selectAll(".state").classed("is-active", false);
      select(".chart-container").classed('tooltip-active',false);
      this.theTooltip.deposition()
    });

  this.stateBorders
    .attr("d", this.path(topojson.mesh(this.stateTopo, this.stateTopo.objects.states, function (a, b) {
      return a !== b;
    })));

  // Optional border outlining the U.S.
  // this.usBorder
  //   .attr("d", this.path(topojson.merge(this.stateTopo, this.stateTopo.objects.states.geometries, d=> d)));

  this.stateLabelGroup
    .attr("transform", d => {
      return "translate(" + this.path.centroid(d)[0] + "," + this.path.centroid(d)[1] + ")";
    });

  this.stateLabelName
    .text(d => this.isMobile == "desktop" ? abbvStateDict[d.properties.st][1] : d.properties.st)
    .attr("x", d => this.isMobile === "mobile" ? positionDict[d.properties.st][2] : positionDict[d.properties.st][0])
    .attr("y", d => this.isMobile === "mobile" ? positionDict[d.properties.st][3] : positionDict[d.properties.st][1])
    .attr("text-anchor", d=> positionDict[d.properties.st][4]);

  /////////////////////////////////////////////////////////////
  // Tiles for DC/PR, and what happens on hover/tap
  /////////////////////////////////////////////////////////////
  let tileSize = this.size === "desktop" ? 27 : 24;
  this.mapTiles
    .attr("height", tileSize)
    .attr("width", tileSize)
    .attr("x", this.width - tileSize - 5)
    .attr("y", (d,i) => this.height - 10 - ((i+1) * (tileSize+1)))
    .on('mouseover', (d,i,e) =>{
      let stateClass = d.properties.st;
      select(`.state.tiles.${stateClass}`).classed('is-active', true).raise();
      this.mapTileLabelGroup.raise();
      select(".chart-container").classed('tooltip-active', true);

      let bbox = document.querySelector(`.state.tiles.${stateClass}`).getBoundingClientRect();

      let coords = [
        bbox.x + bbox.width - bbox.width/2 - 2,
        bbox.y + bbox.height - bbox.height/2
      ];
      let w = this.width + this.margin.left + this.margin.right;
      let h = this.height + this.margin.top + this.margin.bottom;
      this.theTooltip.position(d.properties,coords,[w,h])
    })
    .on('mouseleave', (d,i,e) =>{
      selectAll(".state.tiles").classed("is-active", false);
      select(".chart-container").classed('tooltip-active',false);
      this.theTooltip.deposition()
    });

  this.mapTileLabelGroup
    .attr("transform", (d,i) => {
      return "translate(" + (this.width - tileSize - 5 + tileSize/2) + "," +  (this.height - ((i+1) * (tileSize+1)) + tileSize/2) + ")";
    });

  this.mapTileLabelName
    .text(d => this.isMobile == "desktop" ? abbvStateDict[d.properties.st][1] : d.properties.st)
    .attr("y", -tileSize/4);
  }
}
