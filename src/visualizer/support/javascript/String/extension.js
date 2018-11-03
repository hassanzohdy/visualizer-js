/**
* Get the extension of the file name
*
*/
String.prototype.extension = function () {
    var regex = /(?:\.([^.]+))?$/,
        extension = regex.exec(this)[1];

    return extension || '';
};