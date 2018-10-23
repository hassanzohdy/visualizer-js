/**
* Remove the given needle from the end of string
*
* @param string $needle
* @return string
*/
String.prototype.rtrim = function ($needle = '\\s') {
    var pattern = '[' + $needle + ']*$',
        regex = new RegExp(pattern, 'g');

    return this.replace(regex, "");
};