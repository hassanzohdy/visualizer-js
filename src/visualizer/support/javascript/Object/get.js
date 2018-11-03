/**
 * Get value from the object base on dot notation
 * for example object.get('person.name')
 * This will check if the current object has a property called person
 * if so then we will check if that person object has property called name
 *
 * @param string key
 * @param object object
 * @param mixed $default
 * @return mixed
 */
Object.get = function (object, key, $default = '') {
    let keys = key.split('.');

    if (!object || keys.length == 0) return $default;

    var firstKey = keys.shift(),
        value = object[firstKey];

    if (typeof value == 'undefined') return $default;

    if (keys.length > 0 && value.constructor.name == 'Object') {
        return Object.get(value, keys.join('.'), $default);
    } else {
        return typeof value != 'undefined' ? value : $default;
    }
};

// define it internally 
// $define(Object, 'get', function (key, defaultValue) {
//     return Object.get(this, key, defaultValue);
// });