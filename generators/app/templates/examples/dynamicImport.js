/**
 * An asynchronous Javascript function that dynamically imports data
 * This is a newer version of Promises and callbacks
 * Why it matters: escape promise/callback hell by returning your values asynchronously
 * @param  {string} id
 * @returns {Object} json
 */
async function dynamicImport(id) {
  let json = await import("../data/" + id + ".json");
  return json;
}
