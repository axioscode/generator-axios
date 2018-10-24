import "core-js/es6/promise";
import "core-js/fn/object/assign";
import "core-js/fn/object/entries";
import "core-js/fn/object/values";
import "core-js/fn/array/includes";
import "raf/polyfill";
import "whatwg-fetch";

import {
  setupVisualsGoogleAnalytics
} from "./analytics";
setupVisualsGoogleAnalytics();

require.context("../fallbacks");
require.context("../img");

import "../sass/main.scss";
import "../index.ejs";

if (module.hot) {
  module.hot.accept();
}

export default function setup() {
  if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  (function () {
    const throttle = (type, name, obj) => {
      obj = obj || window;
      let running = false;
      let func = function () {
        if (running) {
          return;
        }
        running = true;
        requestAnimationFrame(() => {
          obj.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      };
      obj.addEventListener(type, func);
    };

    throttle("resize", "optimizedResize");
  })();
}
