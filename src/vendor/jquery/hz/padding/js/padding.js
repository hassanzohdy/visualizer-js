/**
* Calculate the padding for first matched element
*
* @author Hasan Zohdy
* @released 22/07/2017
*/
(function ( $, window ) {
    $.fn.padding = function (direction) {
        var element = $(this).first();

        if (direction) {
            return Number(element.css('padding-' + direction).replace('px', ''));
        } else {
            return Number(element.css('padding-left').replace('px', '')) + Number(element.css('padding-right').replace('px', ''));
        }
    };
}( jQuery, window));