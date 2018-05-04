// const setupVisualsGoogleAnalytics = require('./analytics.js').setupVisualsGoogleAnalytics;
// const trackEvent = require('./analytics.js').trackEvent;

(function() {
  var throttle = function(type, name, obj) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) { return; }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();

const pym = require('pym.js');
const makeChart = require("./chart-template");
// const d3 = require("d3");

if (NodeList.prototype.forEach === undefined) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

document.addEventListener("DOMContentLoaded", main());

function main() {

  const theChart = new makeChart({
    element: document.querySelector('.chart')
  })

  window.addEventListener('optimizedResize', function() {
    theChart.update();
  });

  new pym.Child();
}
