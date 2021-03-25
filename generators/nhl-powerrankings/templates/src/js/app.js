import setup from "./setup";
setup();

import pym from "pym.js";
import makeChart from "./chart-template";

import prevWeek from "../data/prevWeek.json";
import currWeek from "../data/currWeek.json";

export default function main() {
  const theChart = new makeChart({
    element: document.querySelector(".chart"),
    prevWeek,
    currWeek
  });

  window.addEventListener("optimizedResize", () => {
    theChart.update();
  });

  new pym.Child({
    polling: 500,
  });
}

window.onload = main;
