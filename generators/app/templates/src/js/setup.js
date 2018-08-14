import "core-js/es6/promise";
import "core-js/fn/object/assign";
import "core-js/fn/object/entries";
import "core-js/fn/object/values";
import "raf/polyfill";

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

  (function() {
    const throttle = (type, name, obj) => {
      obj = obj || window;
      let running = false;
      let func = function() {
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
