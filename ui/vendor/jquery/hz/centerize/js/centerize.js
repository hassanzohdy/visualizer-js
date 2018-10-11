/**
* Center the element exactly in the middle of the screen
*
* @author Hasan Zohdy
* @released 04/05/2017
*/
(function ( $, window ) {
    $.fn.centerize = function (options) {
        return this.each(function () {
            var element = $(this),
                startAfter = 0;

                /*
                * If the parent width is less than zero
                * then it means we need to wait some time before executing
                */
                if (element.outerWidth() < 10) {
                    startAfter = 100;
                }

                element.hide();

            /* Wait for some time to calculate parent dimensions */
            setTimeout(function () {
                element.css('display', 'inline-block');
                if (typeof options == 'undefined') {
                    options = {
                        'top' : '50%',
                        'margin-top' : - element.outerHeight() / 2,
                        'left' : '50%',
                        'margin-left' : - element.outerWidth() / 2,
                    };
                } else if (options == 'left') {
                    options = {
                        'left' : '50%',
                        'margin-left' : - element.outerWidth() / 2,
                    };

                } else if (options == 'top') {
                    options = {
                        'top' : '50%',
                        'margin-top' : - element.outerHeight() / 2,
                    };
                }

                options.position = 'absolute';

                element.css(options);
            }, startAfter);

        });
    };
}( jQuery, window));