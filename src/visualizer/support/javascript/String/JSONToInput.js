/**
 * Because Json string can't be stored in inputs,
 * So we need to encode it to escape the double quotes conflicts
 *
 * @released 02/01/2018
 * @version 1.0
 */
const JSONToInput = {
    /**
     * Encode the given string and convert it to object
     *
     * @param object object
     * @return string
    */
    encode(object) {
        return encodeURIComponent(JSON.stringify(object));
    },
    /**
     * Decode the given string and convert it to object
     *
     * @param string string
     * @return object
    */
    decode(string) {
        return JSON.parse(decodeURIComponent(string || '{}'));
    },
};