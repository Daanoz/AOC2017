let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');


module.exports = (isPartB) => {
    let input = 329;
    //input = 3;

    let currentPos = 0;

    if(isPartB) {
        let x = 1;
        let cycles = 50000000;
        let valueAfterZero = 0;
        while(x < cycles) {
            currentPos = (currentPos + input + 1) % x;
            if (currentPos === 0 && x < cycles) {
                valueAfterZero = x;
            }
            x++;
        }
        term('%s\n', valueAfterZero);
    } else {
        let buffer = [0];
        for(var x = 1; x <= 2017; x++) {
            currentPos += input
            currentPos = currentPos % buffer.length;
            buffer.splice(currentPos + 1, 0, x);
            currentPos++;
        }
        term('%s\n', buffer[buffer.indexOf(2017) + 1]);
    }
};