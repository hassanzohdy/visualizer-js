/**
* Convert html code to be text only
*
* @param string html
* @return string
*/
function html2Text(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText;
}