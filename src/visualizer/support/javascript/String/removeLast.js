/**
* Remove the last occurrence for the the give needle  
*
* @param  string needle
* @return string
*/
String.prototype.removeLast = function (needle) {
    return this.replaceLast(needle, '');
};