/**
* Chunk array into chunks
*
* @param int size
* @return array
*/
$define(Array, 'chunk', function (size) {
    var arraysList = [];

    for (var i = 0; i < this.length; i += size) {
        arraysList.push(this.slice(i, i + size));
    }

    return arraysList;
});