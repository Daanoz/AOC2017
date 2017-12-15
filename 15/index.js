let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

module.exports = (isPartB) => {
    let genA = 699;
    let genB = 124;

    // genA = 65;
    // genB = 8921;

    let genAMultiplier = 16807;
    let getBMultiplier = 48271;
    let divider = 2147483647;

    let judgeCounter = 0;

    let loops = 40000000;
    if(isPartB) {
        loops = 5000000;
    }

    let nextValueA = () => {
        genA *= genAMultiplier;
        genA %= divider;
    }
    let nextValueB = () => {
        genB *= getBMultiplier;
        genB %= divider;
    }


    for(let i = 0; i < loops; i++) {
        nextValueA();
        nextValueB();
        while(isPartB && genA % 4 !== 0) { nextValueA(); }
        while(isPartB && genB % 8 !== 0) { nextValueB(); }
        //term('%s  %s\n', ('           ' + genA).substr(-10), ('           ' + genB).substr(-10));
        let bitsA = ('0000000000000000' + genA.toString(2)).substr(-16);
        let bitsB = ('0000000000000000' + genB.toString(2)).substr(-16);
        //term('%s\n%s\n', bitsA, bitsB);
        if(bitsA === bitsB) {
            judgeCounter++;
        }
        if(i % 1000000 === 0) {
            term('Currently at %s, %s%\n', i, Math.round((i/loops)*100));
        }
    }

    term('Final judge count: %s\n', judgeCounter);
};