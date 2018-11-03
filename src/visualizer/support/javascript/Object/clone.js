/**
* Clone any javascript object with its properties and methods
*
*/
$define(Object, 'clone', function () {
    return $.extend(true, {}, this);
});