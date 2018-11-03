/**
* Get element id, if it doesn't have one, then create new id and get id
*
* @author Hasan Zohdy
* @released 12/08/2017
*/
(function ( $, window ) {
    /**
    * Generate random id
    *
    * @return string
    */
    function makeId(length) {
        length = length || 32;

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

        for(var i = 0; i < length; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    $.fn.id = function (id) {
        var element = $(this).first();

        if (id) {
            element.attr('id', id);
            return;
        }

        if (! element.attr('id')) {
            element.attr('id', makeId());
        }

        return element.attr('id');
    };
}( jQuery, window));