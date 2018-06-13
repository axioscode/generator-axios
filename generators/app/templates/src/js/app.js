require("./setup")();

const pym = require('pym.js');
const makeChart = require("./chart-template");
let pymChild;
// const setupVisualsGoogleAnalytics = require('./analytics.js').setupVisualsGoogleAnalytics;
// const trackEvent = require('./analytics.js').trackEvent;
// const d3 = require("d3");

document.addEventListener("DOMContentLoaded", main());

function main() {

  const theChart = new makeChart({
    element: document.querySelector('.chart')
  });

  window.addEventListener('optimizedResize', function() {
    theChart.update();
  });

  pymChild = new pym.Child({polling: 500});
}

module.exports = main;
