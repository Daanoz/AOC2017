let term = require('terminal-kit').terminal;
let fs = require('fs');
let path = require('path');
let _ = require('lodash');
let utils = require('./../utils');


let getTaxiCab = (p1, p2) => {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

let setMarkers = (commands) => {
    let currentPos = [0, 0]; // x, y
    commands.forEach(command => {
        switch(command.trim().toLowerCase()) {
            case 'left': currentPos[0]--; break;
            case 'right': currentPos[0]++; break;
            case 'up': currentPos[1]++; break;
            case 'down': currentPos[1]--; break;
            case 'a': addMarker(currentPos, 'A'); break;
            case 'b': addMarker(currentPos, 'B'); break;
            case 'start': return; break;
            default: term.red('Unknown command %s\n', command); break;
        }
    });
};

let addMarker = (pos, type) => {
    markers.push({x: pos[0], y: pos[1], type: type});
};

let draw = () => {
    let xRange = {min: _.minBy(markers, 'x').x, max: _.maxBy(markers, 'x').x };
    let yRange = {min: _.minBy(markers, 'y').y, max: _.maxBy(markers, 'y').y };

    for(let y = yRange.min; y <= yRange.max; y++) {
        for(let x = xRange.min; x <= xRange.max; x++) {
            var posRecords = _.filter(markers, marker => {
                return marker.x === x && marker.y === y;
            });
            if(posRecords.length < 1) {
                term('.');
            } else {
                term(posRecords.length);
            }
        }
        term('\n'); 
    }
}

let markers = [];

module.exports = (isPartB) => {
    console.time('Command parsing');    
    let commands = utils.readInput().split(',');  
    setMarkers(commands);
    console.timeEnd('Command parsing');

    //draw();

    // bruteforce distance
    console.time('Distance calculation');   
    let farestDistance = 0;
    if(!isPartB) {
        markers.forEach(marker1 => {
            let markerDistance = getTaxiCab(marker1, {x: 0, y: 0});
            if(markerDistance > farestDistance) {
                farestDistance = markerDistance;
            }
        });
    } else {
        markers.forEach(marker1 => {
            markers.forEach(marker2 => {
                if(marker1 !== marker2 && marker1.type !== marker2.type) {
                    let markerDistance = getTaxiCab(marker1, marker2);
                    if(markerDistance > farestDistance) {
                        farestDistance = markerDistance;
                    }
                }
            });
        });
    }
    console.timeEnd('Distance calculation');

    term.green('Farest distance: %s', farestDistance)
};
