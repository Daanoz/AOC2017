let term = require('terminal-kit').terminal;
let utils = require('./../utils');

let doSum = (value, index, isPartB) => {
    let nextIndex = index + 1;
    if(isPartB) {
        nextIndex = index + Math.floor(value.length / 2);
    }
    if(nextIndex < value.length) {
        return value.substr(index, 1) === value.substr(nextIndex, 1);
    } else {
        nextIndex = nextIndex - value.length;
        return value.substr(index, 1) === value.substr(nextIndex, 1);
    }
};

let getCapthaSum = (input, isPartB) => {
    let sum = 0;

    for(var i = 0; i < input.length; i++) {
        if(doSum(input, i, isPartB)) {
            sum += parseInt(input.substr(i, 1));
        }
    }

    return sum;
};

module.exports = (isPartB) => {
    let input = utils.readInput();

    if(!isPartB) {
        term('Result for 1122: %s\n', getCapthaSum('1122'));
        term('Result for 1111: %s\n', getCapthaSum('1111'));
        term('Result for 1234: %s\n', getCapthaSum('1234'));
        term('Result for 91212129: %s\n', getCapthaSum('91212129'));
    } else {
        term('Result for 1212: %s\n', getCapthaSum('1212',isPartB));
        term('Result for 1221: %s\n', getCapthaSum('1221',isPartB));
        term('Result for 123425: %s\n', getCapthaSum('123425',isPartB));
        term('Result for 123123: %s\n', getCapthaSum('123123',isPartB));
        term('Result for 12131415: %s\n', getCapthaSum('12131415',isPartB));
    }
    term.bold('Result for input: %s\n', getCapthaSum(input, isPartB));
};