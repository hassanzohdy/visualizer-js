/**
* Fade out the element then remove it
*
* @author Hasan Zohdy
* @released 21/07/2017
*/
(function ( $, window ) {
    $.fn.fadeThenRemove = function () {
        return this.each(function () {
            $(this).fadeOut(function () {
                $(this).remove();
            });
        });
    };
}( jQuery, window));