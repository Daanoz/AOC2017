let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput('input', true);
    let grid = _.map(input, line => line.split(''));
    let xBound = _.maxBy(grid, line => line.length).length;

    let p = [grid[0].indexOf('|'), 0];
    let direction = [0, 1];
    let chars = [];

    let currentCell = () => {
        return grid[p[1]][p[0]];
    };
    let updateDirection = () => {
        if(direction[0] === 0) { // currently vertical
            direction = [(/^[a-z-]$/i.test(grid[p[1]][p[0] - 1]))?-1:1, 0];
        } else { // currently horizontal
            direction = [0, (/^[a-z|]$/i.test(grid[p[1] - 1][p[0]]))?-1:1];
        }
    };
    let applyDirection = () => {
        p[0] += direction[0];
        p[1] += direction[1];
    };

    let steps = 0;
    while(p[0] >= 0 && p[1] >= 0 &&
          p[0] < xBound && p[1] < grid.length) {
        let cell = currentCell();
        if(cell === '+') {
            updateDirection();
        } else if (/^[a-z]$/i.test(cell)) {
            chars.push(cell);
        }
        applyDirection();
        steps++;
    }

    term('Done, sequence: %s, steps: %s\n', chars.join(''), steps);
}