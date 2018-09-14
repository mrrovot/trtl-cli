#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const version = require('./package.json');
var colors = require('colors');


const {
    market,
    supply,
    network,
    price,
    ascii,
    checkpoints,
    nodes,
    transaction
} = require('./index');

program
    .version(version.version)
    .description('TRTL CLI')

program.on('command:*', function() {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

function make_red(txt) {
    return colors.red(txt); //display the help text in red on the console
}

if (!process.argv.slice(2).length) {
    program.outputHelp(make_red);
    return;
}

program
    .command('market')
    .alias('m')
    .description('List market data')
    .action(() => market());

program
    .command('supply')
    .alias('s')
    .description('List circulating supply')
    .action(() => supply());

program
    .command('network')
    .alias('ne')
    .description('Shows network data')
    .action(() => network());

program
    .command('price [qty]')
    .alias('p')
    .description('Update a customer')
    .action((qty) => price(qty));

program
    .command('ascii [pic]')
    .alias('a')
    .description('Displays ASCII art')
    .action((pic) => ascii(pic));

program
    .command('checkpoints')
    .alias('c')
    .description('Get latest checkpoint update')
    .action(() => checkpoints());

program
    .command('nodes')
    .alias('no')
    .description('Get all current nodes')
    .action(() => nodes());

    program
        .command('tx [hash]')
        .alias('t')
        .description('Get Transaction information')
        .action((hash) => transaction(hash));

program.parse(process.argv);
