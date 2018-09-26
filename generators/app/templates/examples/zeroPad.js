// Add zero padding (or another character)
// number, places, character(defaultes to `0`)
function zeroPad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
