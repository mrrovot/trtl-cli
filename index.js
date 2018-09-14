const TurtleCoind = require('turtlecoin-rpc').TurtleCoind
const axios = require('axios')
const colors = require('colors');
const timeago = require("timeago.js");
const easyTable = require('easy-table');
const convert = 100000000

const daemon = new TurtleCoind({
    host: 'public.turtlenode.io'
})

const {
    numberWithCommas,
    formatBytes,
    grabASCII,
    replaceAll,
    getPublicNodeStatuses,
    getTransactionPool,
    checkTransactionPool
} = require('./helpers');

// Grabs coinmarketcap data and output the price of TurtleCoin formatted
const market = () => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/?convert=LTC')
        .then((response) => {
            console.info(`\nCurrent USD Price: $${response.data.data.quotes.USD.price}`)
            console.info(`Current Litoshi Price:    Ł ${(response.data.data.quotes.LTC.price * convert).toFixed(2)}`)
            // Outputs red text if 24hr change is negative, green if 24hr change is positive

            if (response.data.data.quotes.USD.percent_change_24h < 0) {
                console.info(`\n24h price change: ${response.data.data.quotes.USD.percent_change_24h + '%'}`.red)
            } else if (response.data.data.quotes.USD.percent_change_24h > 0) {
                console.info(`24h price change: ${response.data.data.quotes.USD.percent_change_24h}%`.green)
            }

            console.info(`24h Volume: $${response.data.data.quotes.USD.volume_24h.toFixed(2)}`)
            console.info(`Circulating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
        })
        .catch(function(error) {
            console.info(error);
        })
}

// get coinmarketcap data to get circulating supply of TurtleCoin
const supply = () => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/')
        .then(function(response) {
            console.info(`\nCirculating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
        })
        .catch(function(error) {
            console.info(error);
        })

}

// Grabs network data from TurtleCoind
const network = () => {
    daemon.getInfo()
        .then(function(response) {
            console.info(`\nNetwork block height: ${response.network_height}`);
            console.info(`The current global hashrate is: ${formatBytes(response.hashrate)}`);
            console.info(`Mining diffculty: ${response.difficulty}`);
            console.info(`Client version: ${response.version}`);

        })
        .catch(function(error) {
            console.info(error);
        })

}

// Displays specified ASCII or a random ASCII
const ascii = (a) => {
    grabASCII(a)
}

// Given a quantity of TRTL, will give you how much it is worth in USD and LTC
const price = (qty) => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/?convert=LTC')
        .then((response) => {
            var trtl_usd = response.data.data.quotes.USD.price
            var trtl_lit = response.data.data.quotes.LTC.price
            console.info(`\nCurrent price: $${trtl_usd} or Ł ${(trtl_lit * convert).toFixed(2)}`)

            if (qty) {
                console.info(`${qty} TRTL is: $${(trtl_usd * qty.replaceAll(",", "")).toFixed(10)}`)
                console.info(`${qty} TRTL is: $${(trtl_lit * qty.replaceAll(",", "")).toFixed(10)} Litecoin`)
            } else {
                console.info('\n' + `You can try "trtl price <amount>" to calculate how much your TRTLs are worth`.red)
            }
        })
        .catch((error) => {
            console.info(error);
        })
}

// Gets checkpoint update date from Github
const checkpoints = () => {
    axios.get('https://api.github.com/repos/turtlecoin/checkpoints')
        .then((updateInfo) => {
          console.log(`\nCheckpoints updated ${timeago().format(updateInfo.data.updated_at)}`)
          console.log(`Download the latest checkpoint from: http://checkpoints.info/`)
        });
}

// Gets the status of all public nodes on the nodes-json list
const nodes = () => {
  getPublicNodeStatuses('https://raw.githubusercontent.com/turtlecoin/turtlecoin-nodes-json/master/turtlecoin-nodes.json')
    .then((response) => {
      var t = new easyTable

      response.forEach((item) => {
        t.cell('Node', item.name)
        t.cell('URL', item.url)
        t.cell('Port', item.port)
        t.cell('SSL', item.ssl ? "Yes" : "No")
        t.cell('Synced', item.synced ? "Yes" : "No")
        t.newRow()
      })
      t.sort()
      console.info(`\n` + t.toString())
    })
    .catch((err) => {
      console.info(err)
    })
}

const transaction = (hash) => {
  if(hash == undefined) {
    getTransactionPool()
  } else {
    checkTransactionPool(hash)
  }
}

// Export All Methods
module.exports = {
    market,
    supply,
    network,
    price,
    ascii,
    checkpoints,
    nodes,
    transaction
}
