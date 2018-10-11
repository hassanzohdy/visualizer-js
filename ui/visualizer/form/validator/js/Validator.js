class Validator {
    /**
     * Constructor
     * 
     * @param FormHandler formHandler
     * @param object options
     */
    constructor(formHandler, options) {
        this.formHandler = formHandler;

        this.formHandler.form.attr('novalidate', true).addClass('validatable');
        this.errors = {};

        this.rulesList = [
            'required',
            'email',
            'number',
            'is',
            'min',
            'length',
            'max',
            'match',
        ];  

        this.resumeFormOnValid = true;

        this._setOptions(options);

        this.inputs = {};

        if (this.options.events) {
            this.validateByEvents();
        }
    }

    /**
     * Determine whether the form validation passes
     * 
     * @returns bool
     */
    passes() {
        return Is.empty(this.errors);
        // return Is.empty(this.formHandler.find('.err.visible'));
    }

    /**
     * Determine whether the form validation fails
     * 
     * @returns bool
     */
    fails() {
        return ! this.passes();
    }

    /**
     * Set validator options
     * 
     * @param object options
     */
    _setOptions(options) {
        this.options = Object.merge({
            events: 'change blur', // keyup, keydown or this.options.event
            markAsValid: true, // if set to true, then a success class will be added to the form-group
        }, options, Config.get('form.validator'));
    }

    /**
     * Validate form elements while writing, changing or focusing out 
     * 
     */
    validateByEvents() {
        let $this = this,
            inputs = this.formHandler.find('input, select, textarea');

        for (let rule of this.rulesList) {
            let ruleInputs;
            if (['required', 'min', 'match', 'max', 'length'].includes(rule)) {
                ruleInputs = inputs.filter(`[${rule}]`);
            } else if (['email', 'number'].includes(rule)) {
                ruleInputs = inputs.filter(`input[type="${rule}"]`);
            } else if (rule == 'is') {
                ruleInputs = inputs.filter(`[${Validator.VALIDATE_BY_IS}]`);
            }

            this.inputs[rule] = ruleInputs;

            ruleInputs.on(this.options.events, function (e) {
                if (! e) return;
                if ($this.formHandler.isFreezed && e.type == 'keyup' && Keyboard.isPressingOn(e, 'enter')) {
                    return true;
                }

                if ($this.inputHasError($(this), 'custom')) {
                    $this.hideError($(this), 'custom', Validator.DO_NOT_MARK_AS_VALID);
                }

                $this[rule]($(this));
            });
        }
    }

    /**
     * Validate all form inputs
     */
    validate() {
        let $this = this;
        for (let rule in this.inputs) {
            let inputs = this.inputs[rule];

            inputs.each(function () {
                $this[rule]($(this));
            });
        }
    }

    /**
     * Validate all required elements
     */
    validateRequired() {
        let $this = this;
        let inputs = this.inputs.required = this.formHandler.findByAttr('required');

        inputs.on(this.options.events, function (e) {
            let input = $(this);
            $this.required(input);
        });
    }

    /**
     * Validate the given element as required
     * 
     * @param jQuery input
     */
    required(input) {
        let value = input.val();
       
        if (Is.array(value)) {
            if (Is.empty(value)) {
                this._displayError(input, 'required');
            } else {
                this.hideError(input, 'required', Validator.DO_NOT_MARK_AS_VALID);
            }
        } else {
            if (Is.null(value) || input.val().trim() === '') {
                this._displayError(input, 'required');
            } else {
                this.hideError(input, 'required', Validator.DO_NOT_MARK_AS_VALID);
            }       
        }
    }

    /**
     * Validate all match elements
     */
    validateMatch() {
        let $this = this;
        let inputs = this.inputs.match = this.formHandler.findByAttr('match');

        inputs.on(this.options.events, function (e) {
            let input = $(this);
            $this.match(input);
        });
    }

    /**
     * match the given input with the original input
     * 
     * @param jQuery input
     */
    match(input) {
        let originalInput = this.formHandler.get(input.attr('match'));

        if (input.val() != originalInput.val()) {
            this._displayError(input, 'match', 'match', [originalInput.attr('placeholder') || originalInput.attr('name')]);
        } else {
            this.hideError(input, 'match');
        }
    }

    /**
     * Validate all email inputs
     */
    validateEmail() {
        let $this = this;
        let inputs = this.inputs.email = this.formHandler.find('input[type="email"]');

        inputs.on(this.options.events, function () {
            let input = $(this);
            $this.email(input);
        });
    }

    /**
     * Validate the given input value as an email address
     * 
     * @param jQuery input
     */
    email(input) {
        let value = input.val();

        if (value === '') {
            this.hideError(input, 'email', Validator.DO_NOT_MARK_AS_VALID);
            return;
        }

        if (!Is.email(value)) {
            this._displayError(input, 'email');
        } else {
            this.hideError(input, 'email');
        }
    }

    /**
     * Validate all number inputs
     */
    validateNumber() {
        let $this = this;
        let inputs = this.inputs.number = this.formHandler.find('input[type="number"]');

        inputs.on(this.options.events, function () {
            let input = $(this);

            $this.number(input);
        });
    }

    /**
     * Validate the given input value as a valid number
     * Please note that number works with integers and floats
     * 
     * @param jQuery input
     */
    number(input) {
        let value = input.val();

        if (value === '') {
            this.hideError(input, 'number', Validator.DO_NOT_MARK_AS_VALID);
            return;
        }

        if (!Is.numeric(value)) {
            this._displayError(input, 'number');
        } else {
            this.hideError(input, 'number');
        }
    }

    /**
     * Check if the input has the minimum length
     */
    validateMin() {
        let $this = this;
        let inputs = this.inputs.min = this.formHandler.findByAttr('min');

        inputs.on(this.options.events, function () {
            let input = $(this);

            $this.min(input);
        });
    }

    /**
     * Determine whether the given input value length is lower than the min attribute value 
     * 
     * @param jQuery input
     */
    min(input) {
        let value = input.val(),
            minimumLength = Number(input.attr('min'));

        if (Is.NaN(minimumLength) || value == '') {
            this.hideError(input, 'min', Validator.DO_NOT_MARK_AS_VALID);
            return;
        }

        if (value.length < minimumLength) {
            this._displayError(input, 'min', 'min', [minimumLength]);
        } else {
            this.hideError(input, 'min');
        }
    }

    /**
     * Check if the input has the maximum length
     */
    validateMax() {
        let $this = this;
        let inputs = this.inputs.max = this.formHandler.findByAttr('max');

        inputs.on(this.options.events, function () {
            let input = $(this);

            $this.max(input);
        });
    }

    /**
     * Determine whether the given input value length is higher than the min attribute value 
     * 
     * @param jQuery input
     */
    max(input) {
        let value = input.val(),
            maximumLength = Number(input.attr('max'));

        if (Is.NaN(minimumLength) || value == '') {
            this.hideError(input, 'max', Validator.DO_NOT_MARK_AS_VALID);
            return;
        }

        if (value.length < maximumLength) {
            this._displayError(input, 'max', 'max', [maximumLength]);
        } else {
            this.hideError(input, 'max');
        }
    }

    /**
     * Check if the input has exact length
     */
    validateLength() {
        let $this = this;
        let inputs = this.inputs.length = this.formHandler.findByAttr('length');

        inputs.on(this.options.events, function () {
            let input = $(this);

            $this.length(input);
        });
    }

    /**
     * Determine whether the given input value length equals to the length attribute 
     * 
     * @param jQuery input
     */
    length(input) {
        let value = input.val(),
            length = Number(input.attr('length'));

        if (Is.NaN(length) || value == '') {
            this.hideError(input, 'length', Validator.DO_NOT_MARK_AS_VALID);
            return;
        }

        if (value.length != length) {
            this._displayError(input, 'length', 'length', [length]);
        } else {
            this.hideError(input, 'length');
        }
    }

    /**
     * Validate all inputs using the Is class
     */
    validateIs() {
        let $this = this;
        let inputs = this.inputs.is = this.formHandler.findByAttr(Validator.VALIDATE_BY_IS);

        inputs.on(this.options.events, function () {
            let input = $(this);

            $this.is(input);
        });
    }

    /**
     * Validate input using the Supportive Is Class
     * 
     * @param jQuery input 
     */
    is(input) {
        let value = input.val(),
            isMethod = input.attr(Validator.VALIDATE_BY_IS);

        // if the value has a comma, then split the name and the other arguments
        let [methodName, ...args] = isMethod.split(','),
            method = Object.get(Is, methodName);

        if (value === '') {
            this.hideError(input, methodName.replace('.', '-'), Validator.DO_NOT_MARK_AS_VALID);
            return true;
        }

        if (!method(value, ...args)) {
            this._displayError(input, methodName.replace('.', '-'), 'invalid-value');
        } else {
            this.hideError(input, methodName.replace('.', '-'));
        }
    }

    /**
     * Hide Error for the given form control
     * 
     * @param jquery element
     * @param string errorType
     * @param bool markAsValid
     */
    hideError(element, errorType, markAsValid = Validator.MARK_AS_VALID) {
        let formGroup = element.parent('.form-group');

        this.removeError(element, errorType);

        if (this.options.markAsValid && markAsValid === Validator.MARK_AS_VALID && ! this.inputHasErrors(element)) {
            formGroup.addClass(Validator.VALID_CLASS);
        }else {
            formGroup.removeClass(Validator.VALID_CLASS);
        }

        formGroup.find(`.${errorType}`).removeClass('visible');

        // if there is no other errors in that form group
        // then remove the form group error class
        if (Is.empty(formGroup.find('.err.visible'))) {
            formGroup.removeClass(Validator.ERR_CLASS);
        }

        if (this.resumeFormOnValid) {
            this.formHandler.unfreeze();
        }
    }

    /**
     * Remove error from errors list
     * 
     * @param   jQuery input
     * @param   string errorType
     * @returns void
     */
    removeError(input, errorType) {
        let inputName = input.attr('name'),
        inputErrors = this.errors[inputName] || [];

        if (Is.empty(inputErrors)) return;

        this.errors[inputName] = Array.remove(inputErrors, errorType);

        if (Is.empty(this.errors[inputName])) {
            delete this.errors[inputName];
        }
    }

    /**
     * Determine if the given input has error
     * 
     * @param   jQuery input
     * @returns bool
     */
    inputHasErrors(input) {
        let inputErrors = this.errors[input.attr('name')] || [];
        
        return ! Is.empty(inputErrors);
    }


    /**
     * Determine if the given input has the given error type
     * 
     * @param   jQuery input
     * @param   string errorType
     * @returns bool
     */
    inputHasError(input, errorType) {
        if (! this.inputHasErrors(input)) return false;

        return this.errors[input.attr('name')].includes(errorType);
    }

    /**
     * Add new Error
     * 
     * @param   jquery input
     * @param   string errorType
     * @returns bool
     */
    addError(input, errorType) {
        let inputName = input.attr('name'),
            inputErrors = this.errors[inputName] || [];

        // force to display one error only each time
        if (! Is.empty(inputErrors)) return false;
        
        if (! inputErrors.includes(errorType)) {
            inputErrors.push(errorType);
        }

        this.errors[inputName] = inputErrors;

        return true;
    }

    /**
     * Trigger custom errors for the given errors object
     * 
     * @param   object errors
     * @returns void
     */
    triggerErrors(errors) {
        for (let inputName in errors) {
            let messages = errors[inputName],
                input = this.formHandler.get(inputName);

            if (! Is.array(messages)) {
                messages = [messages];
            }

            for (let message of messages) {
                this._displayError(input, 'custom', message);
            }
        }
    }

    /**
     * Display error for the given form control
     * 
     * @param jquery element
     * @param string errorType
     * @param string errorTransText
     * @param array errorTransTextArgs
     */
    _displayError(element, errorType, errorTransText = errorType, errorTransTextArgs = []) {
        let formGroup = element.parents('.form-group').removeClass(Validator.VALID_CLASS),
            errorMsgElement = formGroup.find('.err.' + errorType);

        if (this.addError(element, errorType) === false) return;

        if (Is.empty(errorMsgElement)) {
            errorMsgElement = $('<div class="err ' + errorType + '" />');
            element.after(errorMsgElement);
        }

        if (! errorMsgElement.html().trim()) {
            if (errorTransText === errorType) {
                errorMsgElement.html(trans('validation.' + errorTransText, ...errorTransTextArgs));
            } else {
                errorMsgElement.html(errorTransText);
            }
        }

        errorMsgElement.addClass('visible');

        formGroup.addClass(Validator.ERR_CLASS);

        this.formHandler.unfreeze();
    }
}

Validator.ERR_CLASS = 'errorable';
Validator.VALID_CLASS = 'valid';
Validator.VALIDATE_BY_IS = 'v-is';
Validator.VALIDATABLE = 'validatable';
Validator.MARK_AS_VALID = true;
Validator.DO_NOT_MARK_AS_VALID = false;