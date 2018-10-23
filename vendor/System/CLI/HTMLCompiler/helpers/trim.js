/**
* Remove the given needle from the start and the end of string
*
* @param string $needle
* @return string
*/
String.prototype.trim = function (needle = ' ') {
    if (needle == ' ') {
        return this.replace(/^\s+|\s+$/g, '');
    }

    var pattern = '^' + needle + '+|' + needle + '+$',
        regex = new RegExp(pattern, 'g');

    return this.replace(regex, "");
};