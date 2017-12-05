let term = require('terminal-kit').terminal;
let utils = require('./../utils');

let getDistance = (input) => {
    let ring = Math.floor(Math.sqrt(input));
    ring = ring % 2 === 1 ? ring : (ring - 1);

    let ringStart = Math.pow(ring,  2) + 1;
    let ringDistance = Math.ceil(ring / 2);

    let closestValueRight = (ringStart + (ringDistance - 1));
    return ringDistance + ((input - closestValueRight) % ringDistance);
}


let grid = {p0:{p0:1}};
let gridSize = 1;

let setGridValue = (pos) => {
    let sum = 0;
    for(var x = pos[0] - 1; x <= pos[0] + 1; x++) {
        for(var y = pos[1] - 1; y <= pos[1] + 1; y++) {
            sum += hasPos([x, y]) ? grid[p(x)][p(y)] : 0;
        }
    }
    if(!grid[p(pos[0])]) {
        grid[p(pos[0])] = {};
    }
    grid[p(pos[0])][p(pos[1])] = sum;
    gridSize++;
    return sum;
}
let p = (value) => {
    return 'p' + value;
}
let hasPos = (pos) => {
    return grid[p(pos[0])] && grid[p(pos[0])][p(pos[1])];
}

let findNextPos = (pos, ringSize) =>  {
    if(pos[0] >= 0) {
        if(!hasPos(utils.moveLeft(pos)))    { return utils.moveLeft(pos);  }
        if(!hasPos(utils.moveUp(pos)))      { return utils.moveUp(pos);    }
        if(!hasPos(utils.moveRight(pos)))   { return utils.moveRight(pos); }
        throw 'Could not determine next direction';
    } else {
        if(!hasPos(utils.moveRight(pos)))   { return utils.moveRight(pos); }
        if(!hasPos(utils.moveDown(pos)))    { return utils.moveDown(pos);  }
        if(!hasPos(utils.moveLeft(pos)))    { return utils.moveLeft(pos);  }
        throw 'Could not determine next direction'
    }
}

let findValueInGrid = (input) => {
    let ringSize = 1;
    let pos = [0, 0];
    let currentVal = 1;
    while (currentVal < input) {
        if(gridSize >= Math.pow(ringSize, 2)) {
            ringSize += 2;
            pos = utils.moveRight(pos);
        } else {
            pos = findNextPos(pos, ringSize);
        }
        currentVal = setGridValue(pos);
    }
    return currentVal;
}


module.exports = (isPartB) => {
    let input = 347991;

    term.bold('%s: %s\n', 12, getDistance(12));
    term.bold('%s: %s\n', 23, getDistance(23));
    term.bold('%s: %s\n', 1024, getDistance(1024));

    term.bold('%s: %s\n', input, getDistance(input));
    term('\n');
    term.bold('Next stored value: %s\n', findValueInGrid(input));
};