/**
* Capitalize the first letter in the string
*
* @return string
*/
String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};