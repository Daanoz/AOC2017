let term = require('terminal-kit').terminal;
let fs = require('fs');
let path = require('path');
let _ = require('lodash');
let utils = require('./../utils');

module.exports = (isPartB) => {
    let grid = utils.readGridInput();

    // convert to ints
    _.forEach(grid, (row, index) => grid[index] = _.map(row, (cell) => parseInt(cell))); 

    // get checksum
    let resultA =  _.sum(_.map(grid, (row) => _.max(row) - _.min(row)));

    // get 2nd checksum
    let resultB =  _.sum(_.map(grid, (row) => {
        let rowResult = 0;
        _.forEach(row, (cellA) => {
            _.forEach(row, (cellB) => {
                if(cellA > cellB && cellA % cellB === 0) {
                    rowResult = (cellA / cellB);
                }
            });
        });
        return rowResult;
    }));
    

    term('Checksum A: %s\n', resultA);
    term('Checksum B: %s\n', resultB);
};