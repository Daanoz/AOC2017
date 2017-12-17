let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let shiftBy = (times, programs) => {
    for(x = 0; x < times; x++) {
        programs.unshift(programs.pop());
    }
};

let switchByIndex = (ia, ib, programs) => {
    var h = programs[ia];
    programs[ia] = programs[ib];
    programs[ib] = h;
};

let switchByChar = (a, b, programs) => {
    switchByIndex(programs.indexOf(a), programs.indexOf(b), programs);
};

let doDance = (actions, programs) => {
    _.forEach(actions, (action) => {
        switch(action.type) {
            case 's' : { shiftBy(action.count, programs); } break;
            case 'x' : { switchByIndex(action.a, action.b, programs); } break;
            case 'p' : { switchByChar(action.a, action.b, programs); } break;
            default: { throw 'Unknown action!'; } break;
        }
    });
}

let parseInput = (input) => {
    let actions = [];
    _.forEach(input, (item) => {
        switch(item.substr(0,1)) {
            case 's' : {
                actions.push({type: 's', count: parseInt(item.substr(1))});
            } break;
            case 'x' : {
                let indexes = item.substr(1).split('/');
                actions.push({
                    type: 'x',
                    a: parseInt(indexes[0]),
                    b: parseInt(indexes[1])
                });
            } break;
            case 'p' : {
                let programNames = item.substr(1).split('/');
                actions.push({
                    type: 'p',
                    a: programNames[0],
                    b: programNames[1]
                });
            } break;
            default: { throw 'Unknown input action!'; } break;
        }
    });
    return actions;
}

module.exports = (isPartB) => {
    let input = utils.readCommaSeperatedInput();
    let actions = parseInput(input);
    let programs = 'abcdefghijklmnop'.split('');
    let seenInputs = [programs.join('')];

    doDance(actions, programs);
    term('%s\n', programs.join(''));

    seenInputs.push(programs.join(''));

    let loopAt = 0;
    let i = 0;
    while(i < 1000000000) {
        doDance(actions, programs);
        let pline = programs.join('');
        if(seenInputs.indexOf(pline) < 0) {
            seenInputs.push(pline);
            i++;
        } else {
            loopAt = i;
            i = 1000000000;
        }
    }
    term('Sequence at: %s, number of items: %s\n', loopAt, seenInputs.length);

    let final = seenInputs[1000000000 % seenInputs.length];

    term('%s\n', final);
};