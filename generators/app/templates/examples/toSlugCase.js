/**
 * Transforms a string into a slug, sanitized for HTML use
 * @param  {string} x
 * @returns {string} x
 */
function toSlugCase(x) {
  return x
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
