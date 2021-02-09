import setup from "./setup";
setup();

import pym from "pym.js";
import makeChart from "./chart-template";

let stateTopo = require("../data/states.topo.simple.json");

export default function main() {
  const theChart = new makeChart({
    element: document.querySelector(".map"),
    stateTopo
  });

  window.addEventListener("optimizedResize", () => {
    theChart.update();
  });

  new pym.Child({
    polling: 500,
  });
}

window.onload = main;
