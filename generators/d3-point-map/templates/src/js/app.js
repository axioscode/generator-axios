import setup from "./setup";
setup();

import pym from "pym.js";
import makeMap from "./map-template";

let usTopo = require("../data/states.topo.simple.json");
let stateTopo = require("../data/stateTopo.json");
let theData = require("../data/data.json");

export default function main() {
  const theMap = new makeMap({
    element: document.querySelector(".map"),
    data: theData,
    usTopo,
    stateTopo,
  });

  window.addEventListener("optimizedResize", () => {
    theMap.update();
  });

  new pym.Child({
    polling: 500,
  });
}

window.onload = main;
