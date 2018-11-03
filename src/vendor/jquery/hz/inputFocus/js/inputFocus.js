/**
* Focus on input and set the cursor to the after the last character on that input
*
* @released 03/08/2017
* @author Hasan Zohdy
*/
(function (original) {
    jQuery.fn.inputFocus = function () {
        return this.each(function () {
            var input = $(this);
            var value = input.val();

            input.val('').focus().val(value);
        });
    };
}) (jQuery);