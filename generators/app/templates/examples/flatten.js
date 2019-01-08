/**
 * Flatten an array of arrays into a single array
 * @param  {array} arrays - An array of arrays, e.g. [[1, 2], [3, 4]]
 * @returns {array} - A single array, e.g. [1, 2, 3, 4]
 */
function flatten(array) {
  return [].concat.apply([], array);
}
