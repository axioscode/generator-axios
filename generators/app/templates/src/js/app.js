import setup from "./setup";
setup();

import pym from "pym.js";
import makeChart from "./chart-template";
// import { setupVisualsGoogleAnalytics, trackEvent } from "./analytics";

export default function main() {

  const theChart = new makeChart({
    element: document.querySelector('.chart')
  });

  window.addEventListener('optimizedResize', () => {
    theChart.update();
  });

  new pym.Child({
    polling: 500
  });
}

window.onload = main;
