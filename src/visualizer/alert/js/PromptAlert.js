class PromptAlert {
    constructor(app, settings) {
        this.app = app;
        this.settings = settings;

        if (!this.settings.id) {
            this.settings.id = 'prompt-' + this.app.random.id();
        }

        this.handleInputs();

        let promptBoxHtml = view('alert/prompt', { settings });

        // add the box to the body
        $('body').append(promptBoxHtml);

        this.handleOverlay();
        // auto focus on the input
        setTimeout(() => {

            this.element = $('#' + this.settings.id);

            // get the prompt selectors
            this.promptContent = this.element.find('.prompt-content');
            this.promptForm = this.promptContent.find('.prompt-form');
            this.promptCancelButton = this.promptForm.find('.cancel-button');

            // allow the confirm to be clicked again
            this.promptForm.find('.confirm-button').attr('disabled', false);

            this.handleEvents();

            if (this.settings.position == 'center-center') {
                this.promptContent.addClass('centerize');
            }

            // apply css to the prompt content not the prompt wrapper if user provided it
            if (this.settings.css) {
                this.promptContent.css(this.settings.css);
            }

            this.element.removeClass('hidden');

            if (this.settings.animation) {
                this.app.animate.element(this.promptContent, this.settings.animation.display, this.settings.animation.callback, this.settings.animation.speedMode);
            }

            this.promptForm.find('.prompt-input:visible:first').inputFocus();
        }, 0);
    }

    /**
     * Handle available events
     */
    handleEvents() {
        if (this.settings.on.load) {
            this.settings.on.load(this);
        }

        if (this.settings.closeOnOverlayClick && this.settings.overlay) {
            this.settings.overlay.on('click', () => {
                this.close();
            });
        }

        this.promptForm.on('submit', (e) => {
            e.preventDefault();

            let value = null;

            if (this.settings.inputs.length > 1) {
                value = this.promptForm.serializeObject();
            } else {
                value = this.promptForm.find('.prompt-input:first').val();
            }

            // disable multiple click on the confirm button
            this.promptForm.find('.confirm-button').attr('disabled', true);

            // if user returns false as the result of callback
            // then we won't close the prompt
            if (this.settings.on.confirm && this.settings.on.confirm(value) === false) {
                return false;
            }

            this.close();
        });

        this.promptCancelButton.on('click', e => {
            e.preventDefault();

            if (this.settings.on.cancel && this.settings.on.cancel(this) === false) return false;

            this.close();
        });

        if (this.settings.closeByEscKey) {
            this.app.keyboard.onPressing('escape', (e) => {
                let activeElement = document.activeElement;

                if (this.element.attr('class') == activeElement.className || $.contains(this.element[0], activeElement)) {
                    this.close();
                }
            });
        }
    }


    /**
     * Handle prompt inputs
     */
    handleInputs() {
        if (this.settings.inputs && !Is.array(this.settings.inputs)) {
            this.settings.inputs = [this.settings.inputs];
        }

        let inputs = [];

        for (let attributes of this.settings.inputs) {
            let tagName = 'input',
                input = null,
                options = null;

            if (attributes.type && ['select', 'textarea'].includes(attributes.type)) {
                tagName = attributes.type;
                delete attributes.type;
                // if the type is a select 
                // then check for the options
                if (tagName == 'select' && attributes.options) {
                    options = attributes.options;
                    delete attributes.options;
                }
            }

            if (attributes.class) {
                attributes.class += ' prompt-input';
            } else {
                attributes.class = 'prompt-input';
            }

            input = $(`<${tagName} />`, attributes);

            if (options) {
                for (let option of options) {
                    let selected = option.selected || attributes.value == option.value || false;
                    input.append(new Option(option.text, option.value, selected, selected));
                }

                if (option.value) {
                    input.removeAttr('value');
                }
            }

            if (tagName == 'textarea' && attributes.value) {
                input.html(attributes.value).removeAttr('value');
            }

            if (attributes.placeholder) {
                input.attr('placeholder', attributes.placeholder);
            }

            inputs.push(input);
        }

        this.settings.inputs = inputs;
    }

    /**
     * Handle overlay
     */
    handleOverlay() {
        if (this.settings.overlay) {
            this.settings.overlay.zIndex = 1;
            this.settings.overlay.position = 'prepend';
            this.settings.overlay.id = 'prompt-overlay';
            this.settings.overlay.parent = '#' + this.settings.id;

            this.settings.overlay = this.app.overlay.create(this.settings.overlay).show();
        }
    }

    /**
     * Close the prompt and remove it
     */

    close() {
        if (this.settings.animation.hide) {
            this.app.animate.element(this.element, this.settings.animation.hide, () => {
                this.element.remove();
                if (this.settings.on.close) {
                    this.settings.on.close();
                }
            });
        } else {
            this.element.fadeThenRemove(this.settings.on.close);
        }
    }
}