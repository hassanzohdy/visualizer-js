/**
* Capitalize the firs letter of the string
*
* @return string
*/
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};