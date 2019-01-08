import csvFile1 from "../data/csvFile1.csv";
import csvFile2 from "../data/csvFile2.csv";

/**
 * Import two or more CSV files at the same time
 * @param  {Object} csvFile1
 * @param  {Object} csvFile2
 * @returns {Object[]} [data1, data2]
 */
async function queueImports(csvFile1, csvFile2) {
  let [data1, data2] = await Promise.all([d3.csv(csvFile1), d3.csv(csvFile2)]);

  return [data1, data2];
}
