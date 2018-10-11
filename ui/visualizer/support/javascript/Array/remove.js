/**
* Remove element from array by value
*
* @param array &array
* @param mixed value
* @return array
*/
$define(Array, 'remove', function (value) {
    while (this.indexOf(value) > -1) {
        this.splice(this.indexOf(value), 1);
    }
});