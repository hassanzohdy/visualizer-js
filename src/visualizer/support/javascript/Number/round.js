/**
* Round up numbers
* Precision is used to display number of precision after zero
*
* @param int precision
*/
Number.prototype.round = function (precision) {
    var number = this,
        factor = Math.pow(10, precision),
        tempNumber = number * factor,
        roundedTempNumber = Math.round(tempNumber);

    return roundedTempNumber / factor;
};