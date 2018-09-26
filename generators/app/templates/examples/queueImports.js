import csvFile1 from "../data/csvFile1.csv";
import csvFile2 from "../data/csvFile2.csv";

function queueImports() {
  let [data1, data2] = Promise.all([
    d3.csv(csvFile1),
    d3.csv(csvFile2)
  ]);

  return [data1, data2];
}
