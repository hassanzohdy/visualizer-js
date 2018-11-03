
/**
 * Determine whether the given objects are equal to each other
 * 
 * @param array ...objects
 * @returns bool 
 */
Object.match = (...objects) => {
    const sortObjectByKeyName = (objectToSort) => {
        return Object.keys(objectToSort).sort().reduce((r, k) => (r[k] = objectToSort[k], r), {});
    }

    let matchingObjects = [];

    for (let object of objects) {
        object = Array.isArray(object) ? object : sortObjectByKeyName(object);
        matchingObjects.push(
            JSON.stringify(object)
        );
    }


    // if they are not equal, so they are matching each other
    return [...new Set(matchingObjects)].length !== matchingObjects.length;
};

function unique(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
}