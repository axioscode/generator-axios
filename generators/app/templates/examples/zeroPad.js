/**
 * Add zero padding (or another character)
 * @param  {number} n
 * @param  {number} width - Number of places to pad
 * @param  {number|string} z - Padding char, defaults to 0
 * @return {string} - A zero-padded string
 */
function zeroPad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
