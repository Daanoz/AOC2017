let term = require('terminal-kit').terminal;
let fs = require('fs');
let path = require('path');
let _ = require('lodash');
let utils = require('./../utils');

module.exports = (isPartB) => {
    let phrases = utils.readGridInput();

    let goodPhrases = _.compact(_.map(phrases, (phrase) => {
        if(isPartB) {
            phrase = _.map(phrase, (word) => {
                return word.split('').sort().join('');
            });
        }
        return phrase.length === _.uniq(phrase).length;
    }));

    term.bold('Good phrases: %s\n', goodPhrases.length);
};