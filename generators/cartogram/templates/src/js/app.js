/* eslint-disable */
import setup from "./setup";
setup();
const feta = require("./feta.json");
import pym from "pym.js";
import makeCartogram from "./cartogram";
import thresholdKey from "./thresholdKey";

export default function main() {
  var key = new thresholdKey({
    // element: document.querySelector(`.key`),
    colorRange: [feta['data-gray-100'], '#E19310'],
    // colorRange: ['#fff6b3', '#fee986', '#ffbc3b', '#e19310', '#a56f05'],
    domain: [0, 1, 2],
    breakpoints: [1, 2],
    tickVals: [0, 1, 2],
    showTicks: true
  });

  const carto = new makeCartogram({
    element: document.querySelector(".chart"),
    threshold: key.threshold,
  });

  window.addEventListener("optimizedResize", () => {
    carto.update();
  });

  new pym.Child({
    polling: 500,
  });
}

window.onload = main;
