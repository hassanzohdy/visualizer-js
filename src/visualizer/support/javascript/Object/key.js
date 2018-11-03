/**
 * Get the key from the given object by the given value
 *
 * @param object object
 * @param mixed value
 * @return mixed
 */
Object.key = function (object, value) {
    for (let key in object) {
        if (object[key] == value) return key;
    }

    return null;
};