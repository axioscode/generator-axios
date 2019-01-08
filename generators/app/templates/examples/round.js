/**
 * Round number to nearest decimal place
 * @param  {number} value - Number to round
 * @param  {number} decimals
 * @returns {number} - Rounded number
 */
function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}
