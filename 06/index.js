let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let distribute = (banks) => {
    let biggestAmount = _.max(banks);
    let biggestBank = _.indexOf(banks, biggestAmount);
    banks[biggestBank] = 0;
    for(let b = 0; b < biggestAmount; b++) {
        banks[(biggestBank + b + 1) % banks.length] += 1;
    }
    return banks;
};

module.exports = (isPartB) => {
    let input = [5, 1, 10, 0, 1, 7, 13, 14, 3, 12, 8, 10, 7, 12, 0, 6];
    //input = [0, 2, 7, 0];

    let states = [];
    while(states.indexOf(input.join('|')) < 0) {
        states.push(input.join('|'));
        input = distribute(input);
    }

    term('Cycles: %s\n', states.length);
    term('Cycle length: %s\n', states.length - states.indexOf(input.join('|')));
};