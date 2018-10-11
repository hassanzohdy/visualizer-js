/**
* Cut string for the given length and append ... if string is larger than the given length
*
*/
String.prototype.readMoreChars = function (length, readMoreDots = '...') {
    if (this.length <= length) return this;

    let cutString = this.substring(0, length);

    return cutString + readMoreDots;
};