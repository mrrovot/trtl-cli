#!/usr/bin/env node

const program = require('commander');
const { prompt } = require('inquirer');
const {
  market,
  supply,
  network
} = require('./index');

program 
  .version('1.0.0')
  .description('TRTL CLI')


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



program.parse(process.argv);