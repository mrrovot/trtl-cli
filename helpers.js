const fs = require('fs');
const path = require('path');

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
  const asciiFolder = path.join(__dirname, '../trtl-cli/ascii/')
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

// Given a URL, return a promise containing the status of Public Nodes
function getPublicNodeStatuses (url) {
  return new Promise(function (resolve, reject) {
    const TurtleCoind = require('turtlecoin-rpc').TurtleCoind
    const requestPromise = require('request-promise-native')

    function getInfo (node) {
      return new Promise(function (resolve, reject) {
        node.synced = false
        node.info = {}
        new TurtleCoind({host: node.url, port: node.port}).getInfo().then(function (result) {
          node.synced = result.synced
          node.info = result
          return resolve(node)
        }).catch(function () {
          return resolve(node)
        })
      })
    }

    requestPromise({
      url: url,
      json: true
    }).then(function (result) {
      var promises = []
      for (var i = 0; i < result.nodes.length; i++) {
        promises.push(getInfo(result.nodes[i]))
      }

      Promise.all(promises).then(function (nodeResults) {
        return resolve(nodeResults)
      }).catch(function () {
        return reject(new Error('An error occurred'))
      })
    }).catch(function () {
      return reject(new Error('An error occurred'))
    })
  })
}

// Format Public Node data into a table
function tableify(dataTable) {
  var easyTable = require('easy-table');
  var t = new easyTable

  dataTable.forEach((item) => {
    t.cell('Node', item.name)
    t.cell('URL', item.url)
    t.cell('Port', item.port)
    t.cell('SSL', item.ssl ? "Yes" : "No")
    t.cell('Synced', item.synced ? "Yes" : "No")
    t.newRow()
  })
  t.sort()
  console.info(`\n` + t.toString())
}


module.exports = {
    numberWithCommas,
    formatBytes,
    grabASCII,
    getPublicNodeStatuses,
    tableify
};
