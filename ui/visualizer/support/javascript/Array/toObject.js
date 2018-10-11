/**
* Convert the array to object so it could be iterated over it as a normal object
*
* @return object
*/
$define(Array, 'toObject', function () {
    let obj = {};
        array = this;

    for (let key = 0; key < array.length; key++) {
        obj[key] = array[key];
    }
    return obj;
});