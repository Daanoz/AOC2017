let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let list = [];
let currentPos = 0;
let skipSize = 0;

let seed = (count) => {
    for(let i = 0; i < count; i++) {  list.push(i); }
}

let swap = (i1, i2) => {
    let h = list[i1 % list.length];
    list[i1 % list.length] = list[i2 % list.length];
    list[i2 % list.length] = h;
}

let doTwist = (twistSize) => {
    for(let i = 0; i < Math.floor(twistSize / 2); i++) { 
        swap(currentPos + i, currentPos + (twistSize - (1 + i)));
    }
    currentPos += twistSize + skipSize;
    skipSize++;
};

let toDenseHash = () => {
    let chunks = _.chunk(list, 16);
    return _.map(chunks, (chunk) => {
        return _.reduce(chunk, (result, n) => {
            return result ^ n;
        }, 0);
    });
}

module.exports = (isPartB) => {
    let input = '102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216';
    seed(256);
    let rounds = 1;
    if(!isPartB) {
        input = _.map(input.split(','), number => parseInt(number));
    } else {
        input = _.map(input.split(''), char => char.charCodeAt(0));
        input.push(17, 31, 73, 47, 23);
        rounds = 64;
    }
    for(var r = 0; r < rounds; r++) {
        _.forEach(input, doTwist);
    }
    term.bold('Result PartA: %s\n', list[0] * list[1]);
    let denseHash = toDenseHash();
    term.bold('Result PartB: %s\n', _.map(denseHash, chunk => ('0' + chunk.toString(16)).substr(-2)).join(''));
};