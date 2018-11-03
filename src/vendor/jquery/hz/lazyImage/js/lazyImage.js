/**
* lazyImage Plugin
* This is a simple plugin for loading images lazely
* So it will be displayed only when user scrolls to it
*
* @version v1.0
* @author Hasan Zohdy
* @released 24/10/2017
*/
(function ($) {
    $.fn.lazyImage = function (options) {
        return this.each(function () {
            new LazyImage(this, options || {});
        });
    };

    class LazyImage {
        /**
        * Constructor
        *
        * @param Dom dom
        * @param object options
        */
        constructor(dom, options) {
            this.dom = dom;
            this.element = $(this.dom);
            this.options = Object.assign({}, {
                display: 'image', // image, spinner
                spinnerClass: '', // the spinner class that will be used to be displayed
                placeholderSrc: '', // placeholder source that will be used if display is image
                displayOn: 'scroll', // displayOn can be scroll or load, as the image will be only be displayed when user scrolls to it or it can be 'load' as the image will be displayed when the image is loaded
                displayEffect: 'fade', // can be fade or show
            }, options);

            this.elementHeight = this.element.outerHeight();

            this.elementOffset = this.element.offset().top;

            this.setOriginalSrc();

            this.init();
        }

        /**
        * Set the image original source
        *
        */
        setOriginalSrc() {
            let windowWidth = $(window).width();

            if (this.element.data('desktop-src') && windowWidth >= 1024) {
                this.originalSrc = this.element.data('desktop-src');
            } else if (this.element.data('mobile-src') && windowWidth < 1024) {
                this.originalSrc = this.element.data('mobile-src');
            } else if (this.element.data('src')) {
                this.originalSrc = this.element.data('src');
            }

            if (this.originalSrc && this.element.data('src')) {
                this.element.removeAttr('data-src');
            }
        }

        /**
        * Start lazy image process
        *
        */
        init() {
            // we will create a random and unique id for the image
            this.uniqueClass = 'img-' + Math.floor(Math.random() * 99999999);
            
            this.element.addClass(this.uniqueClass);

            // First we will create a new similar image element
            // as it will replace the current image
            // and it will be one of two types
            // first one it will be an image
            // second option, it will be something like a spinner
            // or whatever element is
            if (this.options.display == 'image') {
                this.options.placeholderSrc = this.element.data('placeholder-src') || this.options.placeholderSrc;

                if (this.options.placeholderSrc) {
                    // now we will set the image src to the placeholder
                    this.element.attr('src', this.options.placeholderSrc);
                }

                this.display();

                if (this.options.displayOn == 'scroll') {
                    this.displayOnScroll();
                } else if (this.options.displayOn == 'load') {
                    this.displayOnLoad();
                }
            }
        }

        /**
        * Display element when user scrolls to it
        *
        */
        displayOnScroll() {
            $(window).on('scroll', () => {
                this.display();
            });
        }

        /**
        * Display image if user is scrolling at it
        *
        */
        display() {
            let scrollTop = $(window).scrollTop(),
                windowHeight = $(window).height();

            
            
            if (this.element.hasClass('loaded')) return;

            if (scrollTop > (this.elementOffset + this.elementHeight - windowHeight) && (this.elementOffset > scrollTop) && (scrollTop + windowHeight > this.elementOffset + this.elementHeight)) {
                this.displayOnLoad();
            }
        }

        /**
        * Display image when it is loaded
        *
        */
        displayOnLoad() {
            this.image = new Image;

            this.image.onload = () => {
                this.onload();
            };

            this.image.src = this.originalSrc;
        }

        /**
        * Start displaying the image when it is loaded
        *
        */
        onload() {
            this.element = $('.' + this.uniqueClass).removeClass(this.uniqueClass);

            if (this.options.displayEffect == 'fade') {
                this.element.hide().attr('src', this.originalSrc).fadeIn();
            } else if (this.options.displayEffect == 'show') {
                this.element.attr('src', this.originalSrc);
            }

            this.element.addClass('loaded');
        }
    }
}(jQuery));