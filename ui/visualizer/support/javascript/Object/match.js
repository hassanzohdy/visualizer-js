
/**
 * Determine whether the given objects are equal to each other
 * 
 * @param array matchedKeys
 * @param array ...objects
 * @returns bool 
 */
Object.match = (matchedKeys = null, ...objects) => {
    let firstObject = null;

    if (typeof matchedKeys == 'object' && matchedKeys.constructor.name != 'Array') {
        firstObject = matchedKeys;
        matchedKeys = Object.keys(firstObject);
    } else {
        firstObject = objects.shift();
    }

    for (let key of matchedKeys) {
        if (typeof firstObject[key] == 'undefined') {
            return false;
        }

        for (let object of objects) {
            if (typeof object[key] == 'undefined') {
                return false;
            }

            if (typeof object[key] == 'object') {
                if (JSON.stringify(object[key]) != JSON.stringify(firstObject[key])) return false;
            } else if (object[key] != firstObject[key]) {
                return false;
            }
        }
    }

    return true;
};