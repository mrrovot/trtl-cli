#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const {
  market,
  supply,
  network,
  ascii
} = require('./index');

program
  .version('1.0.0')
  .description('TRTL CLI')

program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});

if (!process.argv.slice(2).length) {
  program.outputHelp();
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
  .alias('n')
  .description('Shows network data')
  .action(() => network());

  program
    .command('ascii [pic]')
    .alias('a')
    .description('Displays ASCII art')
    .action((pic) => ascii(pic));



program.parse(process.argv);
