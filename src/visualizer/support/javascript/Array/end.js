/**
* Get last element in the array
*
* @return mixed
*/
$define(Array, 'end', function () {
    return this[this.length - 1];
});