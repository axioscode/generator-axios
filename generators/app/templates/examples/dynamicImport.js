/**
 * An asynchronous Javascript function that dynamically imports data
 * This is a newer version of Promises and callbacks
 * Why it matters: escape promise/callback hell by returning your values asynchronously
 * 
 * @param  {string} state_id
 * @returns {object} json
 */
async function getData(state_id) {
  var json = await import("../data/" + state_id + ".topo.json");
  return json;
}
