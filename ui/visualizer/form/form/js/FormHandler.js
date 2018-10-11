class FormHandler {
    /**
    * Constructor
    *
    * @param mixed form
    */
    constructor(form, options = {}) {
        this.plugins = {};
        this.nodes = {};

        this.form = $(form);
        this.isFreezed = false;
        this.options = Object.merge(Config.get('form'), options);
        this.holdButtons = null;
        this.formElement = this.form[0];
        this[0] = this.formElement; // to be used in FormData
        this.holdButtonsTypes = null; // submit | none | all 
        this.isAllowToBeSubmitted = true;
        this.onSubmitCallback = null;
        this.validator = null;
        this.freezedButtons = this.options.freeze ? this.options.freeze.buttons : FormHandler.FREEZE_ALL;

        // validator
        if (typeof Validator != 'undefined') {
            if (!this.options.validatable && this.form.hasClass(Validator.VALIDATABLE)) {
                this.options.validatable = true;
            }
        }

        if (this.options.validatable && typeof Validator == 'undefined') {
            throw new Error('Please include the form/validator package for form validation');
        }

        if (this.options.validatable) {
            let validatorOptions = this.options.validatorOptions || {};

            this.validator = new Validator(this, validatorOptions);
        }

        // load default plugins
        let defaultPlugins = this.options.defaultPlugins;

        if (!Is.empty(defaultPlugins)) {
            this.register(...defaultPlugins);

            for (let plugin in this.plugins) {
                this[plugin]();
            }
        }

        this.on('submit', e => {
            e.preventDefault();
            e.stopImmediatePropagation();

            if (this.options.freeze.onSubmit) {
                this.freeze(this.options.freeze.buttons);
            }

            if (this.validator) {
                let tmpResumeFormOnValid = this.validator.resumeFormOnValid; 
                this.validator.resumeFormOnValid = false;
                this.validator.validate();
                if (this.validator.fails()) {
                    this.unfreeze();
                    this.validator.resumeFormOnValid = tmpResumeFormOnValid;
                    return;
                } else {
                    if (this.onSubmitCallback) {
                        this.onSubmitCallback(e, this);    
                    }
                }
            } else {
                if (this.onSubmitCallback) {
                    this.onSubmitCallback(e, this);    
                }
            }
        });
    }

    /**
     * Add an event listener for the form submission
     * 
     * @param callback callback
     * @returns this 
     */
    onSubmit(callback) {
        this.onSubmitCallback = callback;
        return this;
    }

    /**
     * Register new plugin to the form
     * 
     * @param string(s) plugins
     * @returns void
     */
    register(...plugins) {
        for (let plugin of plugins) {
            this.plugins[plugin] = DI.resolve(plugin + 'Form');
        }
    }

    /**
     * Get plugin object
     * 
     * @param string plugin
     * @returns Form.Plugin
     */
    plugin(plugin) {
        return this.plugins[plugin];
    }

    /**
     * Determine whether the form has the given name
     * 
     * @param string name
     * @returns bool
     */
    has(name) {
        return ! Is.empty(this.findByName(name));
    }

    /**
     * Add dom event to the form
     * 
     */
    on(...args) {
        this.form.on(...args);

        return this;
    }

    /**
     * Focus on the given input in form
     * 
     * @param string name
     * @returns void
     */
    focusOn(name) {
        this.findByName(name).inputFocus();
    }

    /**
     * Set the given value for the given name
     * If the given name does nt exist then a hidden input will be created
     * 
     * @param string name
     * @param mixed value
     * @returns this
     */
    set(name, value) {
        let input = this.findByName(name);

        if (Is.empty(input)) {
            input = DI.resolve('formBuilder').hidden(name);
        }

        input.val(value);

        this.form.append(input.node);

        return this;
    }

    /**
     * Get value by name
     * 
     * @param string name
     * @param mixed defaultValue
     * @return mixed 
     */
    value(name, defaultValue = null) {
        return this.findByName(name).val().trim() || defaultValue;
    }

    /**
     * Trigger errors for the given errors object
     * 
     * @param object errors
     * @returns this
     */
    triggerErrors(errors) {
        this.validator.triggerErrors(errors);
        return this;
    }

    /**
     * Set value for the given name
     * 
     * @param string name
     * @param mixed value
     * @return mixed
     */
    setValue(name, value) {
        return this.findByName(name).val(value);
    }

    /**
     * Find element in the form
     * 
     * @param string selector
     * @returns FormNode 
     */
    find(selector) {
        return this.form.find(selector);
    }

    /**
     * Get a form handler node
     * 
     * @param   string name
     * @returns FormHandler
     */
    node(name) {
        if (! this.nodes[name]) {
            this.nodes[name] = new FormNode(this.get(name));
        }
        
        return this.nodes[name];
    }

    /**
     * Find element in form by name
     * 
     * @param string name
     * @returns object jQuery
     */
    findByName(name) {
        return this.find(`[name="${FormNode.namable(name)}"]`);
    }

    /**
     * An alias method to findByName
     * 
     * @param string name
     * @returns mixed
     */
    get(name) {
        return this.findByName(name);
    }

    /**
     * Find inputs in form by type
     * 
     * @param string type
     * @returns object jQuery
     */
    findByType(type) {
        return this.find(`[type="${type}"]`);
    }

    /**
     * Find element in form by attribute name
     * 
     * @param string attr
     * @returns object jQuery
     */
    findByAttr(attr) {
        return this.find(`[${attr}]`);
    }

    /**
     * Disable|UnDisable element by name
     * 
     * @param string name
     * @param bool disable
     * @returns this
     */
    disable(name, disable = true) {
        this.findByName(name).attr('disabled', disable);

        return this;
    }

    /**
     * Check|UnCheck element by name
     * 
     * @param string name
     * @param bool check
     * @returns this
     */
    check(name, check = true) {
        this.findByName(name).attr('checked', check).prop('checked', check);

        return this;
    }

    /**
     * Submit the Form
     */
    submit() {
        this.form.submit();
    }

    /**
     * Disable the form from being submitted 
     * 
     * @param string holdButtonsTypes `submit` | `all` 
     * @returns this
     */
    freeze(holdButtonsTypes = this.freezedButtons) {        
        if (holdButtonsTypes === FormHandler.FREEZE_NONE) return this;

        this.holdButtons = this.form.find('button');
       
        if (holdButtonsTypes == 'submit') {
            this.holdButtons = this.holdButtons.not('[type="button"]');
        }

        this.isFreezed = true;
        this.holdButtons.attr('disabled', true);
        return this;
    }

    /**
     * Allow form to be submitted again
     * 
     * @returns this
     */
    unfreeze() {
        if (this.holdButtons) {
            this.holdButtons.removeAttr('disabled');
            this.holdButtons = null;
            this.isFreezed = false;
        }

        return this;
    }

    /**
     * Serialize form
     * 
     * @returns string
     */
    serialize() {
        return this.form.serialize();
    }

    /**
     * An alias method to `serialize`
     * 
     * @returns object
     */
    toObject() {
        return this.form.serializeObject();
    }

    /**
     * Convert form values to array of [name, value] objects
     * 
     * @returns array
     */
    toArray() {
        return (new FormData(this.formElement)).entries();
    }

    /**
     * Convert form values to json
     * 
     * @returns string
     */
    toJson() {
        return JSON.stringify(this.toArray());
    }
}

const Form = FormHandler;

FormHandler.FREEZE_SUBMIT_BUTTONS = 'submit';
FormHandler.FREEZE_ALL = 'all';
FormHandler.FREEZE_NONE = 'none';