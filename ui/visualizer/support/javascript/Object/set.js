/**
 * Set value from the object base on dot notation
 * for example object.set('person.name', 'Hasan')
 * This will check if the current object has a property called person
 * if the person object is not found, then it will be created
 *
 * @param object object
 * @param string namespace
 * @param mixed value
 * @return object
 */
Object.set = function (object, key, value) {
    let keys = key.split('.'),
        currentObject = object;

    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (i + 1 == keys.length) {
            currentObject[key] = value;
        } else {
            if (typeof currentObject[key] == 'undefined') {
                currentObject = currentObject[key] = {};
            } else {
                currentObject = currentObject[key];
            }
        }
    }

    return object;
};