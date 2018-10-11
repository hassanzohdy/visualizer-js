/**
* Encode and decode base64
*
*/
const base64 = {
     /**
     * Encode the given value to base64
     *
     * @param string value
     * @return string
     */
    encode(value) {
        return btoa(value);
    },
     /**
     * Decode the given base64 encoded value
     *
     * @param string encodedValue
     * @return mixed
     */
    decode(encodedValue) {       
        return atob(encodedValue);
    },
};