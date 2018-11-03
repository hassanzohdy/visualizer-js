/**
* An equivalent function to sprintf function in php
*
*/
String.prototype.sprintf = function (...args) {
    if (args.length == 0) return this.toString();

    let index = 0;

    return this.replace(/%(d|s)/g, function (matchedPattern, character, position, wholeText) {
        let nextReplacedValue = args[index];
        if (character == 'd') {
            if (typeof nextReplacedValue == 'number') {
                index++;
                return nextReplacedValue;
            } else {
                return matchedPattern;
            }
        } else if (character == 's') {
            if (typeof nextReplacedValue == 'string') {
                index++;
                return nextReplacedValue;
            } else {
                return matchedPattern;
            }
        }
    });
};