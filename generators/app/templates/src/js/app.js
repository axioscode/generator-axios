import "./setup";
setup();

import pym from "pym.js";
import makeChart from "./chart-template";
import setup from "./setup";
// import { setupVisualsGoogleAnalytics, trackEvent } from "./analytics";
// import d3 from "d3";

document.addEventListener("DOMContentLoaded", main());

export default function main() {

  const theChart = new makeChart({
    element: document.querySelector('.chart')
  });

  window.addEventListener('optimizedResize', function() {
    theChart.update();
  });

  new pym.Child({polling: 500});
}
