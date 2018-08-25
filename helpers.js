var fs = require('fs');

//helper to get number with commas
const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

//helper transfer kilohashes to mgh
function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1000,
        d = b || 2,
        e = ["Bytes", "KH/s", "MH/s", "GH/s", "TH/s", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
}

//Grabs a text file that has ASCII text to display under the "swanson" command
function grabASCII(file){
  var picture = fs.readFileSync("./ascii/" + file + ".txt").toString('utf-8');
  var textByLine = picture.split('');
  console.info(textByLine.join(''));
}

module.exports = {
    numberWithCommas,
    formatBytes,
    grabASCII
};
