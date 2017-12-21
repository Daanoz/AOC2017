let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let lineRegex = /^([#./]*) => ([#./]*)$/;

let dictionary = {};

let rotateBlock = (block) => {
    let length = block.length;
    for(let row = 0; row < (length / 2); row++){
        for(let col = row; col < ( length - 1 - row); col++){
            let tmpVal = block[row][col];
            for(let i = 0; i < 4; i++) {
                let rowSwap = col;
                let colSwap = (length - 1) - row;
                let poppedVal = block[rowSwap][colSwap];
                block[rowSwap][colSwap] = tmpVal;
                tmpVal = poppedVal;
                col = colSwap;
                row = rowSwap;
            }
        }
    }
};
let flipBlock = (block) => {
    return _.map(block, line => _.reverse(_.clone(line)));
};
let addToDictionary = (block, result) => {
    let lines = _.map(block.split('/'), line => line.split(''));
    for(let f = 0; f < 2; f++) {
        for(let r = 0; r < 4; r++) {
            let blockId = _.map(lines, line => line.join('')).join('/');
            dictionary[blockId] = result.split('/');
            rotateBlock(lines);
        }
        lines = flipBlock(lines);
    }
}

module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();
    input.forEach(line => {
        let matches = lineRegex.exec(line);
        if(!matches) {
            throw 'Unable to match: ' + line;
        } else {
            addToDictionary(matches[1], matches[2]);
        }
    });

    let image = [
        '.#.',
        '..#',
        '###'
    ];

    for(let i = 0; i < (isPartB?18:5); i++) {
        let newImage = [];
        let blockSize = (image.length % 2 === 0) ? 2 : 3
        let blockCount = image.length / blockSize;
        for(let y = 0; y < blockCount; y++) {
            for(let x = 0; x < blockCount; x++) {
                let blockId = _.map(
                    image.slice(y * blockSize, (y + 1) * blockSize),
                    line => line.substr(x * blockSize, blockSize)
                ).join('/');
                let newBlock = dictionary[blockId];
                if(!newBlock) {
                    console.log(dictionary);
                    throw 'Cannot find ' + blockId;
                } else {
                    _.forEach(newBlock, (newBlockLine, newBlockIndex) => {
                        let newImageIndex = y * (blockSize + 1) + newBlockIndex;
                        if(!newImage[newImageIndex]) {
                            newImage[newImageIndex] = '';
                        }
                        newImage[newImageIndex] += newBlockLine;
                    });
                }
            }
        }
        term('Done with iteration: %s\n', i + 1);
        image = newImage;
    }

    let onCount = (image.join('').match(/#/g) || []).length;
    term('Number of ON: %s\n', onCount);
};