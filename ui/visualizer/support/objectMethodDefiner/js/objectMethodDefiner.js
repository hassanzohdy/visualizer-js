/**
 * This function is used to allow you to define a method to the given
 * object prototype without messing around with the for..in syntax
 * 
 * @param   Object objectName
 * @param   string methodName
 * @param   callback callback
 * @returns void 
 */
function newMethodOf(objectName, methodName, callback) {
    Object.defineProperty(objectName.prototype, methodName, {
        enumerable: false,
        value: callback,
    });
}

const $define = newMethodOf;