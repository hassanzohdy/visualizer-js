/**
 * Generate a text for the given string that will be used for urls
 * 
 * @param string string
 * @return string
 */
const seo = string => {
    // remove any white spaces from the beginning and
    //the end of the given string
    string = string.trim();

    string = string.replace(/\s+/g, '-');

    string = string.replace(/[^\u0621-\u064A\-A-Z0-9]+/gi, '-');

    string = string.replace(/[\-]+/g, '-');

    return string.toLowerCase();
};