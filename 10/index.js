let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let toDenseHash = (list) => {
    let chunks = _.chunk(list, 16);
    return _.map(chunks, (chunk) => {
        return _.reduce(chunk, (result, n) => {
            return result ^ n;
        }, 0);
    });
}

let swap = (i1, i2, l) => {
    let h = l[i1 % l.length];
    l[i1 % l.length] = l[i2 % l.length];
    l[i2 % l.length] = h;
}

let doTwist = (list, pos) => {
    return (twistSize) => {
        for(let i = 0; i < Math.floor(twistSize / 2); i++) {
            swap(pos.current + i, pos.current + (twistSize - (1 + i)), list);
        }

        pos.current += twistSize + pos.skip;
        pos.skip++;
    };
};

let seed = (count) => {
    let list = [];
    for(let i = 0; i < count; i++) {
       list.push(i);
    }
    return list;
}


let doKnotHash = (input) => {
    let list = seed(256);
    let pos = { current: 0, skip: 0 };
    let chars = _.map(input.split(''), char => char.charCodeAt(0));
    chars.push(17, 31, 73, 47, 23);

    for(var r = 0; r < 64; r++) {
        _.forEach(chars, doTwist(list, pos));
    }

    let denseHash = toDenseHash(list);
    return _.map(denseHash, chunk => ('0' + chunk.toString(16)).substr(-2)).join('');
};

module.exports = (isPartB) => {
    let input = '102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216';
    if(!isPartB) {
        let list = seed(256);
        let pos = { current: 0, skip: 0 };
        input = _.map(input.split(','), number => parseInt(number));
        _.forEach(input, doTwist(list, pos));
        term.bold('Result PartA: %s\n', list[0] * list[1]);
    } else {
        let hash = doKnotHash(input);
        term.bold('Result PartB: %s\n', hash);
    }
};
module.exports.hash = doKnotHash;