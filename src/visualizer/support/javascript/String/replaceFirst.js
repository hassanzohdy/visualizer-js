/**
* Replace the last occurrence for the the give needle  
*
* @param  string needle
* @param  string replacement
* @return string
*/
String.prototype.replaceFirst = function (needle, replacement) {
    var pattern = '^' + needle,
        regex = new RegExp(pattern);

    return this.replace(regex, replacement);
};