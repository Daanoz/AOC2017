let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let coordregex = /(?:p|v|a)=<([-0-9]*),([-0-9]*),([-0-9]*)>/;

let doTick = (particle) => {
    particle.vel[0] += particle.acc[0];
    particle.vel[1] += particle.acc[1];
    particle.vel[2] += particle.acc[2];
    particle.pos[0] += particle.vel[0];
    particle.pos[1] += particle.vel[1];
    particle.pos[2] += particle.vel[2];
};

let distance = (particle) => {
    return Math.abs(particle.pos[0]) + Math.abs(particle.pos[1]) + Math.abs(particle.pos[2]);
};

let isSame = (particleA, particleB) => {
    return particleA.pos[0] === particleB.pos[0] &&
           particleA.pos[1] === particleB.pos[1] &&
           particleA.pos[2] === particleB.pos[2];
};

module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();
    let particles = [];
    _.forEach(input, (line) => {
        let parts = line.split(', ');
        let posMatch = coordregex.exec(parts[0]);
        let veloMatch = coordregex.exec(parts[1]);
        let accelerationMatch = coordregex.exec(parts[2]);
        if(posMatch && veloMatch && accelerationMatch) {
            particles.push({
                index: particles.length,
                pos: [parseInt(posMatch[1]), parseInt(posMatch[2]), parseInt(posMatch[3])],
                vel: [parseInt(veloMatch[1]), parseInt(veloMatch[2]), parseInt(veloMatch[3])],
                acc: [parseInt(accelerationMatch[1]), parseInt(accelerationMatch[2]), parseInt(accelerationMatch[3])],
            });
        } else {
            throw 'Not matched: ' + line;
        }
    });

    for(var x = 0; x < 500; x++) {
        _.forEach(particles, (particle) => {
            doTick(particle);
        });
        if(isPartB) {
            var thrashCan = [];
            _.forEach(particles, (particleA) => {
                _.forEach(particles, (particleB) => {
                    if(particleA !== particleB) {
                        if(isSame(particleA, particleB)) {
                            thrashCan.push(particleA, particleB);
                        }
                    }
                });
            });
            _.remove(particles, (particle) => {
                return thrashCan.indexOf(particle) >= 0;
            });
        }
    }

    let particle = _.minBy(particles, distance);
    term('Done closest: %s, remaining: %s\n', particle.index, particles.length);
}