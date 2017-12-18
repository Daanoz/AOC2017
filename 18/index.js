let term = require('terminal-kit').terminal;
let _ = require('lodash');
let utils = require('./../utils');

let lineRegex = /([a-z]{3}) ([a-z0-9]) ?([a-z0-9-]*)?/;

class Program {
    constructor(programId, _commands) {
        this.programId = programId;
        this.registery = { p: programId};
        this.commands = _commands;
        this.recovery = 0;
        this.waitForValue = undefined;
        this.position = 0;
        this.sendQueue = [];
        this.sendCounter = 0;
        this.instructions = {
            snd : (reg)      => { this.sendQueue.push(this.getVal(reg)); this.sendCounter++; },
            set : (reg, val) => { this.registery[reg] = this.getVal(val); },
            add : (reg, val) => { this.registery[reg] += this.getVal(val); },
            mul : (reg, val) => { this.registery[reg] *= this.getVal(val); },
            mod : (reg, val) => { this.registery[reg] %= this.getVal(val); },
            rcv : (reg)      => {
                this.waitForValue = reg;
                if(this.getVal(reg) !== 0) { this.recovery = this.sendQueue[this.sendQueue.length - 1]; }
            },
            jgz : (reg, val) => {
                if(this.getVal(reg) > 0) {
                    this.position += this.getVal(val);
                    this.position--;
                }
            }
        };
    };

    getVal(x) {
        if(this.registery[x]) { return this.registery[x]; }
        return parseInt(x);
    };

    exec(cmd) {
        this.instructions[cmd.func].apply(this, cmd.params);
    };

    recieveValue(val) {
        this.registery[this.waitForValue] = val;
        this.waitForValue = undefined;
    };

    isRunning() {
        return !!this.commands[this.position] && this.waitForValue === undefined;
    };

    tick() {
        if(!this.isRunning()) { return; }
        this.exec(this.commands[this.position]);
        this.position++;
    };

    runPart1() {
        while(this.recovery === 0) {
            this.tick();
        }
        return this.recovery;
    };
};


module.exports = (isPartB) => {
    let input = utils.readNewLineSeperatedInput();
    let commands = [];
    _.forEach(input, (line) => {
        let matches = line.match(lineRegex);
        if(matches) {
            let cmd = {
                func: matches[1],
                params: [matches[2]]
            };
            if(matches[3]) { cmd.params.push(matches[3]); }
            commands.push(cmd);
        }
    });

    if(!isPartB) {
        let program = new Program(0, commands);
        term('First recovered: %s\n', program.runPart1());
    } else {
        let programA = new Program(0, commands);
        let programB = new Program(1, commands);
        while(programA.isRunning() || programB.isRunning()) {
            programA.tick();
            programB.tick();
            if(programA.waitForValue && programB.sendQueue.length > 0) { programA.recieveValue(programB.sendQueue.shift()); }
            if(programB.waitForValue && programA.sendQueue.length > 0) { programB.recieveValue(programA.sendQueue.shift()); }
        }
        term('Number of sends: %s\n', programB.sendCounter);
    }

};