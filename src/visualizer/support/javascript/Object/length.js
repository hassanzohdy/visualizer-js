/**
 * Get object length
 * 
 * @param object object
 * @return int
 */
Object.length = function (object) {
    let length = 0;
    for (let key in object) {
        length++;
    }

    return length;
};
