/**
* Convert new lines to break tags
*
* @param string str
* @return string
*/
function nl2br(str) {
    return (str + '').replace(/(\r\n|\n\r|\r|\n)/g, '<br />$1');
}