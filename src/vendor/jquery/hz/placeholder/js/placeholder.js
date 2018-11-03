/**
* Display placeholder instead of value in inputs and textareas
*
* @author Hasan Zohdy
* @released 22/09/2017
*/
(function ( $, window ) {
    $.fn.placeholder = function (options) {
        return this.each(function () {
            if (! $(this).attr('placeholder') || $(this).attr('placeholder').length == 0) return;

            var defaultPlaceholder = $(this).attr('placeholder');

            $(this).attr('data-placeholder', defaultPlaceholder);

            if ($(this).val() == '') {
                $(this).val(defaultPlaceholder);
            }
        }).on('focus', function () {
            if (! $(this).attr('data-placeholder')) return;

            var value = $(this).val();
            var placeholder = $(this).data('placeholder');

            // remove any error class
            $(this).removeClass('error');
            // remove error messages if found
            $(this).next('.err-msg').remove();

            if (value == placeholder) {
                $(this).val('');
            }
        }).on('focusout', function () {
            if (! $(this).attr('data-placeholder')) return;
            if ($(this).val() == '') {
                $(this).val($(this).data('placeholder'));
            }
        });
    };
}( jQuery, window));