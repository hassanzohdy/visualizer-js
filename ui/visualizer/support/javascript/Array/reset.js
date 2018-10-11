/**
* Reset array keys to start from 0 index
*
* @return array
*/
$define(Array, 'reset', function () {
    return this.filter(item => item !== undefined);
});