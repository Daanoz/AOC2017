let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let lineRegex = /^([a-z]*) \((.*)\)(?: -> )?(.*)$/;
let programLookup = {};
let issueSize = 0;

let parseInput = (input) => {
    let result = {};
    _.forEach(input, (line) => {
        let matches = lineRegex.exec(line);
        if(!matches) {
            term.red('Unabled to parse: %s', line);
        } else {
            let program = {
                name: matches[1],
                weight: parseInt(matches[2]),
                totalWeight: 0,
                childs: matches[3]?matches[3].split(', '):[]
            };
            result[program.name] = program;
        }
    });
    return result;
}

let calculateTotalWeights = (node) => {
    let program = programLookup[node];
    let childSum = _.reduce(program.childs, (sum, child) => {
        return sum + calculateTotalWeights(child);
    }, 0);
    program.totalWeight = program.weight + childSum;
    return program.totalWeight;
};
let locateIssue = (node) => {
    let program = programLookup[node];
    if(program.childs.length === 1) {
        // only one child, that has to contain the issue
        return locateIssue(program.childs[0]);
    }
    if(program.childs.length === 2) {
        throw 'Unhandled flow, not enough childs to determine broken branch';
    }
    let groups = _.groupBy(program.childs, (child) => {
        return programLookup[child].totalWeight;
    });
    let weights = _.keys(groups);
    if(weights.length < 2) {
        // found the issue
        return program;
    } else if (weights.length == 2)  {
        if(groups[weights[0]].length === 1) {
            issueSize = weights[0] - weights[1];
            return locateIssue(groups[weights[0]][0]);
        } else {
            issueSize = weights[1] - weights[0];
            return locateIssue(groups[weights[1]][0]);
        }
    } else {
        throw 'More than 2 different weights found, should not be possible!';
    }
};

module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();
    programLookup = parseInput(input);
    let programs = _.keys(programLookup);
    _.forEach(programLookup, (program) => {
        _.forEach(program.childs, (childProgram) => {
            programs = _.pull(programs, childProgram);
        });
    });
    let baseProgram = programs[0];
    term('Base program: %s, total: %s\n', baseProgram, programs.length);

    calculateTotalWeights(baseProgram);
    let programWithIssue = locateIssue(baseProgram);
    term('Program with issue: %s, issue size: %s, old weight: %s, new weight: %s\n', programWithIssue.name, issueSize, programWithIssue.weight, programWithIssue.weight - issueSize);
};