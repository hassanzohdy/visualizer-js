/**
* Remove element from array by value
*
* @param array &array
* @param mixed value
* @return array
*/
Array.remove = function (array, value) {
    while (array.indexOf(value) > -1) {
        array.splice(array.indexOf(value), 1);
    }

    return array;
}