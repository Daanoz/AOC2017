let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let lineRegex = /^(\d*): (\d*)$/;

let layers = [];

let getHits = (offset) => {
    let hits = [];
    _.forEach(layers, (layer) => {
        let cycleSize = (layer.range - 1) * 2;
        if(((layer.offset + 1) + offset) % cycleSize === 1) {
            hits.push(layer);
        }
    });
    return hits;
};

module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();

    _.forEach(input, (line) => {
        let matches = lineRegex.exec(line);
        if(matches) {
            layers.push({
                offset: parseInt(matches[1]),
                range: parseInt(matches[2])
            });
        }
    });

    let hits = getHits(0);
    let severity = _.reduce(hits, (sum, hit) => {
        return sum + hit.range * hit.offset;
    }, 0);
    term('Severity: %s\n', severity);

    let offset = 0;
    while(hits.length > 0) {
        hits = getHits(offset);
        offset++;
    }
    term('Safe offset: %s\n', offset-1);
};
