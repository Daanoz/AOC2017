let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let discardIgnored = /(<.*?)(!.)/;
let discardTrash = /(<.*?>)/g;
let groupMatch = /{([0-9,]*)}/g;

let trashRemoved = 0;

let takeOutThrash = (input) => {
    while(discardIgnored.test(input)) {
        input = input.replace(discardIgnored, '$1');
    }

    // some vars to count the number of thrash removed
    let before = input.length;
    let thrashCount = input.match(discardTrash).length;

    // remove the trash
    input = input.replace(discardTrash, '');

    thrashRemoved = before - (thrashCount * 2) - input.length;
    return input;
}

let getGroupScore = (input) => {
    input = input.replace(/{,*}/g, 1);
    while(groupMatch.test(input)) {
        //term.red('%s\n', input);
        input = input.replace(groupMatch, function(a, b) {
            let parts = _.compact(b.split(','));
            parts = _.map(parts, (part) => {
                return parseInt(part) + 1;
            });
            parts.push(1);
            return parts.join(',');
        });
    }
    return _.reduce(input.split(','), (sum, item) => {
        return sum + parseInt(item);
    }, 0);
};

module.exports = () => {
    let input = utils.readInput();

    let sanitized = takeOutThrash(input);
    term('Group score: %s, thrash removed: %s\n', getGroupScore(sanitized, 1), thrashRemoved);
};