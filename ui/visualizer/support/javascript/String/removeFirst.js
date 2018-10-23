/**
* Remove the first occurrence for the the give needle  
*
* @param  string needle
* @return string
*/
String.prototype.removeFirst = function (needle) {
    return this.replaceFirst(needle, '');
};