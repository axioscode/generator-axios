var setupVisualsGoogleAnalytics = require('./analytics.js').setupVisualsGoogleAnalytics;
var trackEvent = require('./analytics.js').trackEvent;

var pym = require('pym.js');
var pymChild = null;

let d3 = require("d3");


import makeChart from "./chart-template";

if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = Array.prototype.forEach
}

document.addEventListener("DOMContentLoaded", main());

function main() {

  let theChart = new makeChart({
  	element: document.querySelector('.chart')
  })

  d3.select(window).on("resize", d=> {
  	theChart.update();
  });

  var pymChild = new pym.Child();

}