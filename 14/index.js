let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');
let knotHash = require('./../10').hash;

let getRowBits = (row) => {
    let hashed = knotHash(row);
    return _.map(hashed.split(''), (hexChar) => {
        return ('000' + parseInt(hexChar, 16).toString(2)).substr(-4);
    }).join('');
};

let replaceStringAtIndex = (row, pos, newChar) => {
    let chars
}

let removeFoundRegion = (grid, y, x) => {
    if(!grid[y] || grid[y][x] !== '1') { return; }
    grid[y][x] = '0';
    removeFoundRegion(grid, y - 1, x);
    removeFoundRegion(grid, y + 1, x);
    removeFoundRegion(grid, y, x - 1);
    removeFoundRegion(grid, y, x + 1);
};

let removeRegion = (grid) => {
    let foundRow = -1;
    let foundColumn = -1;
    _.forEach(grid, (row, index) => {
        foundColumn = row.indexOf('1');
        if(foundColumn >= 0) {
            foundRow = index;
            return false;
        }
    });
    if(foundRow < 0) { return false; }
    removeFoundRegion(grid, foundRow, foundColumn);
    return true;
};

module.exports = (isPartB) => {
    let input = 'ljoxqyyw';
    let squares = 0;
    let grid = [];

    for(var i = 0; i < 128; i++) {
        let row = getRowBits(input + '-' + i).split('');
        grid.push(row);
        squares += _.filter(row, item => item === '1').length;
    }
    term('Squares: %s\n', squares);

    let hasRegion = true;
    let regions = 0;
    while(hasRegion && regions < 10000) {
        hasRegion = removeRegion(grid);
        if(hasRegion) {
            regions++;
        }
    }

    term('Regions: %s\n', regions);
}
