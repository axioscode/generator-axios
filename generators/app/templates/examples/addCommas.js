/**
 * Add commas to a number and make it a string
 * @param  {number} val
 * @returns {string} val
 */
function addCommas(val) {
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return val;
}
