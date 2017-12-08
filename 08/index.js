let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let lineRegex = /^([a-z]*) (inc|dec) ([-0-9]*) if ([a-z]*) (<=|>=|!=|>|<|==) ([-0-9]*)$/;
let registry = {};
let maxOverall = 0;

let parseInput = (input) => {
    _.forEach(input, (line) => {
        let matches = lineRegex.exec(line);
        if(!matches) {
            term.red('Unabled to parse: %s', line);
        } else {
            let compareRegistryValue = getRegistry(matches[4]);
            let compareValue = parseInt(matches[6]);
            let result;
            switch(matches[5]) {
                case '<=' : { result = compareRegistryValue <= compareValue; } break;
                case '>=' : { result = compareRegistryValue >= compareValue; } break;
                case '!=' : { result = compareRegistryValue != compareValue; } break;
                case '>'  : { result = compareRegistryValue >  compareValue; } break;
                case '<'  : { result = compareRegistryValue <  compareValue; } break;
                case '==' : { result = compareRegistryValue == compareValue; } break;
                default: throw 'unknown operator: ' + matches[5]; break;
            }
            if (result) {
                let registryValue = getRegistry(matches[1]);
                if(matches[2] == 'inc') {
                    registry[matches[1]] = registryValue + parseInt(matches[3]);
                } else {
                    registry[matches[1]] = registryValue - parseInt(matches[3]);
                }
                if(registry[matches[1]] > maxOverall) {
                    maxOverall = registry[matches[1]];
                }
            }
        }
    });
};

let getRegistry = (key) => {
    if(!registry[key]) {
        registry[key] = 0;
    }
    return registry[key];
}

module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();
    parseInput(input);

    let maxValue = _.max(_.values(registry));
    term('Max value: %s\n maxOverall: %s\n', maxValue, maxOverall);
};