let term = require('terminal-kit').terminal;
let fs = require('fs');
let path = require('path');
let utils = require('./utils');

term('Advent of Code 2017 \n');

if(!process.argv[2]) { return term.red('No day specified\n'); }

let folder = utils.getDayPath();
if(!fs.existsSync(folder)) { return term.red('Day %s does not exist\n', day); }

let daySolver = require(folder);
daySolver(process.argv[3] === 'part2');