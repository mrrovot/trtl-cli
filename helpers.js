const fs = require('fs');
const path = require('path');
const asciiFolder = path.join(__dirname, '../trtl-cli/ascii/');

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

// Outputs a random Integer from min to max (ex. 0-1 if there are 2 elements)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1));
}

// Displays random ASCII text or specific ASCII
function grabASCII(file){
  //If there was not a file specified / Default command
  if(file === undefined){
    // For outputting every file in a directory
    fs.readdir(asciiFolder, (err, files) => {
      if (err) throw err;
      var randomFile = fs.readFileSync(path.join(asciiFolder, files[getRandomInt(1, files.length)]), 'utf8');
      console.info(randomFile); // If no error, Join ASCII directory to a filename in the files array and print
    })
  } else {
    // If file is specified, print that out
    var ascii = fs.readFileSync(path.join(asciiFolder, file + ".txt"), 'utf8')
    console.info(ascii)
  }
}

// replaces all commas for trtl worth calculation
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


module.exports = {
    numberWithCommas,
    formatBytes,
    grabASCII
};
