/**
 * Define a `getter` value to the given object
 * 
 * @param {object|class|function} object 
 * @param {string} property 
 * @param {callback} callbackValue 
 */
Object.getter = function (object, property, callbackValue) {
    Object.defineProperty(object.prototype, property, {
        get: callbackValue.bind(object),
    });
};