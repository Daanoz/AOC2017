let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let currentPos = [0, 0];

let moveVertical = (direction) => {
    currentPos[1] += (direction * 2);
};
let moveUp = (direction) => {
    currentPos[1]++;
    currentPos[0] += direction;
};
let moveDown = (direction) => {
    currentPos[1]--;
    currentPos[0] += direction;
};
let getDistanceToOrigin = () => {
    let xDelta = Math.abs(currentPos[0]);
    let yDelta = Math.abs(currentPos[1]);
    if(xDelta > yDelta) {
        return yDelta + (xDelta - yDelta);
    } else {
        return xDelta + ((yDelta - xDelta) / 2);
    }
};

module.exports = (isPartB) => {
    let input = utils.readInput().split(',');

    let furthest = 0;
    _.forEach(input, (move) => {
        switch(move) {
            case 'n': moveVertical(1); break;
            case 's': moveVertical(-1); break;
            case 'sw': moveDown(-1); break;
            case 'se': moveDown(1); break;
            case 'nw': moveUp(-1); break;
            case 'ne': moveUp(1); break;
            default: throw 'Unknown direction: ' + move;
        }
        let distanceToOrigin = getDistanceToOrigin();
        if(furthest < distanceToOrigin) {
            furthest = distanceToOrigin;
        }
    });

    term('CurrentPos: %s, Distance: %s, furshest: %s\n', currentPos, getDistanceToOrigin(), furthest);
};

