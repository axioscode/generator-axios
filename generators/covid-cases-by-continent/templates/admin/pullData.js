const fs = require("fs");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    fs.writeFileSync("../src/data/data.json", JSON.stringify(myObj));
  }
};

xmlhttp.open("GET", "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json", true);
xmlhttp.send();