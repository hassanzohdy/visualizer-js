/**
 * Alert component V1.1
 * This component part of HZ Forntend Framework
 *
 * @author Hasan Zohdy
 * @email <hassanzohdy@gmail.com>
 * @lastUpdated 23/12/2017
 */
class Alert {
    /**
    * Constructor
    *
    */
    constructor(view, animate, overlay, keyboard) {
        this.view = view;
        this.animate = animate;
        this.overlay = overlay;
        this.keyboard = keyboard;
        if (!$.fn.fadeThenRemove) {
            throw new Error(`Alert Component requires the fadeThenRemove jquery plugin`);
        }

        if (!$.fn.inputFocus) {
            throw new Error(`Alert Component requires the inputFocus jquery plugin`);
        }

        this.defaults = {
            newAlert: {
                type: null,
                label: '',
                message: '',
                messageClass: '',
                icon: '',
                css: {},
                duration: 3000,
                overlay: null,
                autoPosition: true,
                closeOnOverlayClick: true,
                removeOnClick: true,
                autoplay: true,
                done: () => { },
                id: 'alert-' + Random.id(),
                animation: {
                    display: 'fadeInDown',
                    hide: 'fadeOut',
                },
                render: (alert) => {
                    return this.app.view.render('alert/alert', {}, alert);
                },
            },
            success: {
                type: 'success',
                label: 'success',
                icon: 'fa fa-check-circle',
            },
            error: {
                type: 'error',
                label: 'error',
                icon: 'fa fa-times-circle',
            },
            warning: {
                type: 'warning',
                label: 'warning',
                icon: 'fa fa-warning',
            },
            info: {
                type: 'info',
                label: 'info',
                icon: 'fa fa-info-circle',
            },
            loading: {
                type: 'loading',
                label: 'loading',
                icon: 'fa fa-spin fa-spinner ',
            },
            inform: {
                heading: '',
                type: 'inform',
                label: 'inform',
                message: '',
                duration: 0,
                overlay: {
                    theme: 'dark',
                    opacity: 0.3,
                },
            },
            progress: {
                overlay: null,
                label: 'info',
                heading: '',
                css: {},
                message: '',
                onConfirm: () => { },
                buttons: {
                    progress: {
                        text: 'Yes',
                    },
                },
                animation: {
                    display: 'fadeInDown',
                    hide: 'fadeOut',
                },
            },
            confirm: {
                overlay: null,
                label: 'info',
                heading: '',
                css: {},
                headingIcon: '',
                message: '',
                onConfirm: () => { },
                onCancel: () => { },
                closeByEscKey: true,
                closeOnOverlayClick: false,
                autoFocusOn: 'confirm',
                buttons: {
                    confirm: {
                        text: 'Yes',
                        class: '',
                    },
                    cancel: {
                        text: 'No',
                        class: '',
                    },
                },
                animation: {
                    display: 'fadeIn',
                    hide: 'fadeOut',
                    speedMode: 'normal',
                },
            },
            prompt: {
                id: null,
                overlay: null,
                class: null,
                heading: {
                    text: null,
                    icon: null,
                },
                position: 'top-center', // top-center | center-center
                label: 'info',
                message: '',
                defaultValue: '',
                on: {
                    load: null, // or callback
                    conform: null, // on clicking on confirm button
                    cancel: null, // when clicking on cancel button
                    close: null, // triggered when clicking on close button or after clicking on confirm button
                },
                inputs: [{
                    name: 'prompt-input',
                    type: 'text',
                    // list of other attributes
                }], // a list of inputs that will be appended to the prompt as each input object MUST have name
                animation: {
                    display: 'fadeInDown',
                    speedMode: 'normal',
                    hide: 'fadeOut',
                },
                closeByEscKey: true,
                closeOnOverlayClick: false,
                buttons: {
                    confirm: {
                        class: null,
                        text: 'Confirm',
                    },
                    cancel: {
                        class: null,
                        text: 'Cancel',
                    },
                },
            }
        };

        this.alerts = {};
    }

    /**
    * Clear all alerts
    *
    */
    clear() {
        for (let alertType in this.alerts) {
            this.alerts[alertType].clear();
        }
    }

    /**
    * Remove alert type
    *
    */
    clearType(alertType, animation) {
        if (this.alerts[alertType]) {
            this.alerts[alertType].clear(animation);
        }
    }

    /**
     * Finish the given alert type animation immediately
     * @param string alertType 
     */
    finish(alertType) {
        if (this.alerts[alertType]) {
            this.alerts[alertType].finish();
        }
    }

    /**
    * Create new Success Alert
    *
    */
    success(message, duration = 3000, callback) {
        let defaultOptions = this.defaults.success;

        let userOptions = {};

        if (typeof message == 'object') {
            userOptions = message;
        } else {
            userOptions = {
                message: message,
                duration: duration,
                done: callback,
            };
        }

        return this.newAlert(Object.merge(defaultOptions, userOptions));
    }

    /**
    * Create new Error Alert
    *
    */
    error(message, duration = 3000, callback) {
        let defaultOptions = this.defaults.error;

        let userOptions = {};

        if (typeof message == 'object') {
            userOptions = message;
        } else {
            userOptions = {
                message: message,
                duration: duration,
                done: callback,
            };
        }

        return this.newAlert(Object.merge(defaultOptions, userOptions));
    }

    /**
    * Create new Warning Alert
    *
    */
    warning(message, duration = 3000, callback) {
        let defaultOptions = this.defaults.warning;

        let userOptions = {};

        if (typeof message == 'object') {
            userOptions = message;
        } else {
            userOptions = {
                message: message,
                duration: duration,
                done: callback,
            };
        }

        return this.newAlert(Object.merge(defaultOptions, userOptions));
    }

    /**
    * Create new Info Alert
    *
    */
    info(message, duration = 3000, callback) {
        let defaultOptions = this.defaults.info;

        let userOptions = {};

        if (typeof message == 'object') {
            userOptions = message;
        } else {
            userOptions = {
                message: message,
                duration: duration,
                done: callback,
            };
        }

        return this.newAlert(Object.merge(defaultOptions, userOptions));
    }

    /**
    * Create new Loading Alert
    *
    */
    loading(message = 'Loading...', duration = 0, callback) {
        let defaultOptions = this.defaults.loading;

        let userOptions = {};

        if (typeof message == 'object') {
            userOptions = message;
        } else {
            userOptions = {
                message: message,
                duration: duration,
                done: callback,
            };
        }

        return this.newAlert(Object.merge(defaultOptions, userOptions));
    }

    /**
    * Create new Alert
    *
    */
    newAlert(options) {
        options = this.getOptions('newAlert', options);

        let alert = new AlertItem(options, this.app);

        if (!this.alerts[options.type]) {
            this.alerts[options.type] = new AlertsCollection(alert);
        }

        this.alerts[options.type].add(alert);

        return alert;
    }

    /**
    * Create new Inform Alert
    *
    */
    inform(options) {
        options = this.getOptions('inform', options);

        return this.newAlert(options);
    }

    /**
    * Display a progress bar popup
    *
    * @param options
    * @return void
    */
    progress(options) {
        let settings = Object.merge(this.defaults.progress, options);

        let progressBox = $('<div class="alert-progress-box" />'),
            progressContent = $('<div class="progress-content" />'),
            progressHeading = $('<div class="progress-heading" />'),
            progressMessage = $('<div class="progress-message" />').html(settings.message),
            progressProgressBarContainer = $('<div class="progress-bar-container" />'),
            progressProgressBar = $('<div class="progress-bar" />'),
            progressBarText = $('<div class="progress-bar-text" />').html('0%'),
            progressButtons = $('<div class="progress-buttons" />'),
            progressConfirmButton = $('<button type="button" class="confirm-button" />').html(settings.buttons.confirm.text).attr('disabled', true);

        if (settings.overlay) {
            settings.overlay.position = 'prepend';
            settings.overlay.parent = '.progress-box';
            settings.overlay.id = 'progress-overlay';

            this.app.overlay.create(settings.overlay).show();
        }

        // add the label to content
        progressContent.addClass(settings.label);

        progressHeading.append('<div class="heading-text">' + settings.heading + '</div>');

        if (settings.headingIcon) {
            progressHeading.append('<i class="' + settings.headingIcon + '" />');
        }

        // add the heading to the content
        progressContent.append(progressHeading);

        // add the message to the content
        progressContent.append(progressMessage);

        // add the progress bar text to the progress bar container
        progressProgressBarContainer.append(progressProgressBar).append(progressBarText);

        // add the progress bar container to the box
        progressContent.append(progressProgressBarContainer);

        // add progress/cancel buttons to buttons container
        progressButtons.append(progressConfirmButton);

        // add the buttons to the content
        progressContent.append(progressButtons);

        // add the content to the box
        progressBox.append(progressContent);

        // apply css if user provided it
        progressBox.css(settings.css);

        // add the box to the body
        progressBox.appendTo('body');

        if (settings.animation) {
            this.app.animate.element(progressContent, settings.animation.display);
        }

        progressConfirmButton.on('click', function (e) {
            e.preventDefault();

            settings.onConfirm();

            if (settings.animation.hide) {
                this.app.animate.element(progressContent, settings.animation.hide, () => {
                    progressContent.remove();
                });
            } else {
                progressContent.fadeThenRemove();
            }
        });

        return {
            message: (message) => {
                progressMessage.html(message);
            },
            progress: (percentage) => {
                progressProgressBar.css('width', percentage + '%');
                progressBarText.html(percentage + '%');
            },
            complete: (message, label) => {
                progressConfirmButton.removeAttr('disabled');
                if (message) {
                    progressConfirmButton.html(message);
                }

                if (label) {
                    progressContent.removeClass(settings.label).addClass(label);
                }
            },
        };
    }

    /**
    * Display a confirm message
    *
    * @param options
    * @return void
    */
    confirm(options) {
        let settings = Object.merge(this.defaults.confirm, options);

        let confirmBox = $('<div class="confirm-box" />'),
            confirmContent = $('<div class="confirm-content" />'),
            confirmHeading = $('<div class="confirm-heading" />'),
            confirmMessage = $('<div class="confirm-message" />').html(settings.message),
            confirmButtons = $('<div class="confirm-buttons" />'),
            confirmConfirmButton = $('<button type="button" class="confirm-button" />').html(settings.buttons.confirm.text),
            confirmCancelButton = $('<button type="button" class="cancel-button" />').html(settings.buttons.cancel.text);

        // add the label to content
        confirmContent.addClass(settings.label);

        confirmHeading.append('<div class="heading-text">' + settings.heading + '</div>');

        if (settings.headingIcon) {
            confirmHeading.append('<i class="' + settings.headingIcon + '" />');
        }

        // add the heading to the content
        confirmContent.append(confirmHeading);

        // add the message to the content
        confirmContent.append(confirmMessage);

        // add confirm/cancel buttons to buttons container

        confirmButtons.append(confirmCancelButton).append(confirmConfirmButton);

        // add the buttons to the content
        confirmContent.append(confirmButtons);

        // add the content to the box
        confirmBox.append(confirmContent);

        // apply css if user provided it
        confirmBox.css(settings.css);

        // add the box to the body
        confirmBox.appendTo('body');

        if (settings.animation) {
            this.app.animate.element(confirmContent, settings.animation.display);
        }

        // auto focus on the confirm button

        if (settings.autoFocusOn) {
            confirmContent.find(`.${settings.autoFocusOn}-button`).focus();
        }

        if (settings.overlay) {
            settings.overlay.position = 'prepend';
            settings.overlay.zIndex = -1;
            settings.overlay.parent = '.confirm-box';
            settings.overlay.id = 'confirm-overlay';

            this.app.overlay.create(settings.overlay).show();
        }

        confirmConfirmButton.on('click', function (e) {
            e.preventDefault();

            settings.onConfirm();

            confirmCancelButton.click();
        });

        confirmCancelButton.on('click', function () {
            settings.onCancel();

            if (settings.animation.hide) {
                if (confirmBox[settings.animation.hide]) {
                    confirmBox[settings.animation.hide](function () {
                        confirmBox.remove();
                    });
                } else {
                    this.app.animate.element(confirmBox, settings.animation.hide, () => {
                        confirmBox.remove();
                    });
                }
            } else {
                confirmBox.fadeThenRemove();
            }

            return false;
        });

        if (settings.closeByEscKey) {
            this.app.keyboard.onPressing(confirmBox, 'escape', (e) => {
                let activeElement = document.currentClickedElement || document.activeElement;

                if (confirmBox.attr('class') == activeElement.className || $.contains(confirmBox[0], activeElement)) {
                    confirmCancelButton.click();
                }
            });
        }
    }

    /**
     * Get options for the given key and override it with the given options
     *
     * @param string defaultName
     * @param object options
     * @return object
     */
    getOptions(defaultName, options) {
        return Object.merge(this.defaults[defaultName], options);
    }

    /**
    * Prompt user to enter a value in a field
    *
    * @param options
    * @returns PromptAlert
    */
    prompt(options) {
        let settings = this.getOptions('prompt', options);

        return new PromptAlert(this.app, settings);
    }
}

DI.register({
    class: Alert,
    alias: 'alert',
});