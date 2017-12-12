let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let lineRegex = /^(\d*) <-> ([0-9, ]*)$/;

let seenList = [];

let locateGroup = (pipes, program, list) => {
    if(!pipes[program]) { return; }
    let childPrograms = pipes[program];
    delete pipes[program];
    _.forEach(childPrograms, (linkedProgram) => {
        if(list.indexOf(linkedProgram) < 0) {
            list.push(linkedProgram);
            locateGroup(pipes, 'p' + linkedProgram, list);
        }
    });
    return list;
};

module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();

    let pipes = {};

    _.forEach(input, (line) => {
        let matches = lineRegex.exec(line);
        if(matches) {
            pipes['p' + matches[1]] = matches[2].split(', ');
        }
    });

    let group0List = locateGroup(pipes, 'p0', []);
    term('Group zero size: %s\n', group0List.length);

    let groupCount = 1;
    while(_.keys(pipes).length > 0) {
        groupCount++;
        locateGroup(pipes, _.keys(pipes)[0], []);
    }
    term('Group count %s\n', groupCount);
};

