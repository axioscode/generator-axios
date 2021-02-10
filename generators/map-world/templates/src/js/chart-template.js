const d3 = Object.assign({},
    require("d3-geo-projection"),
    require("d3-geo"),
    require("d3-selection"),
    require("d3-scale")
  );
  
  export default class makeChart {
    constructor(opts) {
      Object.assign(this, opts);
      this.countries = require('data/countries.json');
      this.data = require('data/data.json');

      this.map();
    }
  
    map() {
      var margin = {
          top: 10,
          left: 10,
          bottom: 10,
          right: 10
        },
        width = parseInt(d3.select('.chart-container').style('width')),
        width = width - margin.left - margin.right,
        mapRatio = .5,
        height = width * mapRatio;
        // The svg
      var svg = d3.select(".chart").append("svg").attr("height", height).attr("width", width),
        width = width,
        height = height;
      // Map and projection
      var projection = d3.geoRobinson()
        .scale(width / 6)
        .center([20, 20])
        .translate([width * 0.5, height * 0.5]);
  
      // Data and color scale
      var countries = this.countries;
      var data = this.data;
      this.labelData = this.labels;
      // DEFINE COLORS AND RANGE
      var colorScale = d3.scaleThreshold()
        .domain([1, 2])
        .range(['#eee', '#FFBC3B', '#3FB4FF']);
  
      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
          if (data[d.id]) {
            var total = data[d.id].code;
            return colorScale(total);
          } 
        })
        .attr("stroke", function (d) {

            return "#dcdcdc";

        });
  
      if (width > 450) {
        // this.countryNameLabels = svg
        //   .selectAll(".countryLabels")
        //   .data(this.labelData)
        //   .enter()
        //   .append("text")
        //   .attr("class", "labels")
        //   .text(d => {
        //     return d.name;
        //   });
  
        // this.countryNameLabels.attr(
        //   "transform",
        //   d => "translate(" + projection([d.lon, d.lat]) + ")"
        // );
      }
  
  
    }

  
  };