var setupVisualsGoogleAnalytics = require('./analytics.js').setupVisualsGoogleAnalytics;
var trackEvent = require('./analytics.js').trackEvent;

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

  window.addEventListener('optimizedResize', function() {
  	theChart.update();
  });

  var pymChild = new pym.Child();

}