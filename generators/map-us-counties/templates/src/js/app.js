import setup from "./setup";
setup();

import pym from "pym.js";
import makeChart from "./chart-template";

let stateTopo = require("../data/states.topo.simple.json");
let countyTopo = require("../data/usa_counties_20m_2017.topo.json")

export default function main() {
  const theChart = new makeChart({
    element: document.querySelector(".map"),
    stateTopo,
    countyTopo
  });

  window.addEventListener("optimizedResize", () => {
    theChart.update();
  });

  new pym.Child({
    polling: 500,
  });
}

window.onload = main;
