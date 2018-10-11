/**
* Copy all attributes of current selector to the given elements
*
* @author Hasan Zohdy
* @released 13/10/2017
*/
(function ( $, window ) {
    $.fn.cloneAttributesTo = function (elementThatWillHaveClonedAttributes) {
        var element = $(this).first(),
            attributes = element.prop("attributes");

        // loop through current element attributes and apply them on the given elements
        $.each(attributes, function() {
            $(elementThatWillHaveClonedAttributes).attr(this.name, this.value);
        });
    };
}( jQuery, window));