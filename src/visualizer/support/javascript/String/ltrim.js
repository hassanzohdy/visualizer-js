/**
* Remove the given needle from the start of string
*
* @param string $needle
* @return string
*/
String.prototype.ltrim = function ($needle) {
    $needle = $needle ? $needle : '\\s';

    var pattern = '^' + $needle + '+',
        regex = new RegExp(pattern, 'g');

    return this.replace(regex, "");
};
                             
/**
* Remove the given string from the start of current string
*
* @param string removedString
* @return string
*/
String.prototype.removeFirst = function (removedString) {
    return this.indexOf(removedString) == 0 ? this.substr(removedString.length) : '';
};