/**
 * Sorts an array of objects given an attribute to sort by
 * @param  {Object[]} arr
 * @param  {string|number} attribute
 * @param  {string} [order] - Optional. Defaults to ascending but can be "desc"
 * @returns {Object[]} a
 */
export default function sortBy(arr, attribute, order) {
  let d = arr.slice();
  let numSort = d.every(function(d) {
    return typeof d[attribute] == "number";
  });
  let a = [];
  if (numSort) {
    a = d.sort(function(a, b) {
      return a[attribute] - b[attribute];
    });
  } else {
    a = d.sort(function(a, b) {
      return a[attribute] < b[attribute]
        ? -1
        : a[attribute] > b[attribute]
        ? 1
        : 0;
    });
  }
  return order == "desc" ? a.reverse() : a;
}
