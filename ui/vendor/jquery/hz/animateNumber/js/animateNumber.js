/**
* Animated counter Plugin for animating numbers
*
* @version v1.0
* @author Hasan Zohdy
* @released 03/07/2017
*/
(function ( $ ) {
    $.fn.animateNumber = function (options) {
        var options = options || {};

        if (! options.duration) {
            options.duration = 2000;
        }

        return this.each(function () {
            var element = $(this);
            var duration = element.data('duration') || options.duration;
            var number = Number(element.text());

            element.text('0');

            element.prop('Counter', 0).animate({
                Counter: number,
            }, {
                duration: duration,
                easing: 'swing',
                step: function (now) {
                    if (options.each) {
                        options.each(now, element);
                    } else {
                        element.text(Math.ceil(now));
                    }
                },
            });
        });
    };
}( jQuery ));