import "core-js/es6/promise";
import "core-js/fn/object/assign";
import "core-js/fn/object/entries";
import "core-js/fn/object/values";
import "../sass/main.scss";
import main from "./app";

export default function setup() {
  if (NodeList.prototype.forEach === undefined) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  (function () {
    const throttle = (type, name, obj) => {
      obj = obj || window;
      var running = false;
      var func = function () {
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

    throttle('resize', 'optimizedResize');
  })();

  if (module.hot) {
    module.hot.accept('./app', () => {
      console.log("HMR accepting app");
      main();
    });
  }
}
