const TurtleCoind = require('turtlecoin-rpc').TurtleCoind
const axios = require('axios')
const colors = require('colors')
const convert = 100000000

const daemon = new TurtleCoind({
  host: 'public.turtlenode.io'
})

const {
    numberWithCommas,
    formatBytes,
    grabASCII,
    replaceAll
} = require('./helpers');

const market = () => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/?convert=LTC')
    .then((response) => {
        console.info(`\nCurrent USD Price: $${response.data.data.quotes.USD.price}`)
        console.info(`Current Litoshi Price: 	Ł ${(response.data.data.quotes.LTC.price * convert).toFixed(2)}`)
        // Outputs red text if 24hr change is negative, green if 24hr change is positive

        if(response.data.data.quotes.USD.percent_change_24h < 0){
          console.info(`\n24h price change: ${response.data.data.quotes.USD.percent_change_24h + '%'}`.red)
        } else if(response.data.data.quotes.USD.percent_change_24h > 0){
          console.info(`24h price change: ${response.data.data.quotes.USD.percent_change_24h}%`.green)
        }

        console.info(`24h Volume: $${response.data.data.quotes.USD.volume_24h.toFixed(2)}`)
        console.info(`Circulating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
    })
    .catch(function(error) {
        console.info(error);
    })
}

const supply = () => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/')
        .then(function(response) {
            console.info(`\nCirculating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
        })
        .catch(function(error) {
            console.info(error);
        })

}

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

const ascii = (a) => {
  grabASCII(a)
}

const price = (qty) => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/?convert=LTC')
        .then((response) => {
            var trtl_usd = response.data.data.quotes.USD.price
            var trtl_lit = response.data.data.quotes.LTC.price
            console.info(`\nCurrent price: $${trtl_usd} or Ł ${(trtl_lit * convert).toFixed(2)}`)

            if (qty) {
                console.info(`${qty} TRTL is: $${(trtl_usd * qty.replaceAll(",", "")).toFixed(10)}`)
                console.info(`${qty} TRTL is: ${(trtl_lit * qty.replaceAll(",", "")).toFixed(10)} Litecoin`)
            } else {
                console.info('\n' + `You can try "trtl price <amount>" to calculate how much your TRTLs are worth`.red)
            }
        })
        .catch((error) => {
            console.info(error);
        })
}

// Export All Methods
module.exports = {
    market,
    supply,
    network,
    price,
    ascii
}
