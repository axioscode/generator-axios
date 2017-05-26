var setupVisualsGoogleAnalytics = require('./analytics.js').setupVisualsGoogleAnalytics;
var trackEvent = require('./analytics.js').trackEvent;

var pym = require('pym.js');

var pymChild = null;

document.addEventListener("DOMContentLoaded", main());

function main() {
  var pymChild = new pym.Child();
}
