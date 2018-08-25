const axios = require('axios')
const colors = require('colors')

const {
    numberWithCommas,
    formatBytes,
    grabASCII,
    replaceAll
} = require('./helpers');

const market = () => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/')
        .then(function(response) {
            console.info(`Current price: $${response.data.data.quotes.USD.price}`)
            console.info(`24h price change: ${response.data.data.quotes.USD.percent_change_24h}%`)
            console.info(`24h Volume: $${response.data.data.quotes.USD.volume_24h}`)
            console.info(`Circulating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
        })
        .catch(function(error) {
            console.info(error);
        })

}

const supply = () => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/')
        .then(function(response) {
            console.info(`Circulating supply: ${numberWithCommas(response.data.data.circulating_supply)}`)
        })
        .catch(function(error) {
            console.info(error);
        })

}

const network = () => {
    axios.get('http://public.turtlenode.io:11898/getinfo')
        .then(function(response) {
            console.info(`Network block height: ${response.data.network_height}`);
            console.info(`The current global hashrate is: ${formatBytes(response.data.hashrate)}`);
            console.info(`Mining diffculty: ${response.data.difficulty}`);
            console.info(`Client version: ${response.data.version}`);

        })
        .catch(function(error) {
            console.info(error);
        })

}

const ascii = (a) => {
    grabASCII(a)
}

const price = (qty) => {
    axios.get('https://api.coinmarketcap.com/v2/ticker/2958/')
        .then(function(response) {
            var trtl_price = response.data.data.quotes.USD.price
            console.info(`Current price: $${response.data.data.quotes.USD.price}`)

            if (qty) {
                console.info(`${qty}TRTL is: $${(trtl_price * qty.replaceAll(",", "")).toFixed(2)}`)
            } else {
                console.info('\n' + `You can try "trtl price <amount>" to calculate how much your TRTLs are worth`.red)
            }
        })
        .catch(function(error) {
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