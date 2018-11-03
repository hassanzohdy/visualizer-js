/**
* Get the closest relative parent to the element
*
* @author Hasan Zohdy
* @released 06/05/2017
*/
(function ( $, window ) {
    $.fn.relativeParent = function () {
        var element = $(this);

        return element.parents().filter(function() {
            var $this = $(this);
            return $this.is('body') || $this.css('position') == 'relative';
        }).slice(0,1);
    };
}( jQuery, window));