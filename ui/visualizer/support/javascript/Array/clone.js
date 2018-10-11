/**
* Clone array and return new one
*
* @param array array
* @returns array
*/
$define(Array, 'clone', function () {
    return this.slice();
});