/**
* Determine whether the current string endswith the given string
*
* @param string string
* @param bool caseSensitive when set to false, then letters wont't be case sensitive
* @return string
*/
String.prototype.endsWith = function (string, caseSensitive) {
    caseSensitive = typeof caseSensitive != 'undefined' ? Boolean(caseSensitive) : true;

    var flag = caseSensitive ? '' : 'i';

    var regex = new RegExp(string + '$', flag);

    return regex.test(this);
};