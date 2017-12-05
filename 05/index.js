let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');


module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();
    let jmps = _.map(input, item => parseInt(item.trim()));

    let i = 0;
    let counter = 0;
    while(jmps[i] !== undefined) {
        let currentJmp = i;
        i += jmps[i];
        counter++;
        if (!isPartB || jmps[currentJmp] < 3) {
            jmps[currentJmp]++;
        } else {
            jmps[currentJmp]--;
        }
    }

    term('Steps: %s\n', counter);
};