class FormGroupBuilder {
    /**
    * Constructor
    *
    * @param DomBuilder dom
    */
    constructor(formBuilder) {
        this.formBuilder = formBuilder;

        this._prepareTemplates();
    }

    /**
     * Prepare templates
     */
    _prepareTemplates() {
        this.templates = Object.merge(Config.get('form.builder.group.templates'), {
            input: formGroup => {
                return `
                <div class="form-group">
                    <label for="${formGroup.id()}">${formGroup.label()}</label>
                    ${formGroup.input}
                </div>            
                `;
            },
            textarea: formGroup => {
                return this.templates.input(formGroup);
            },
            image: formGroup => {
                return this.templates.input(formGroup);
            },
            select: formGroup => {
                return this.templates.input(formGroup);
            },
            checkbox: formGroup => {
                return `
                <div class="form-group">
                    ${formGroup.input}
                    <label for="${formGroup.id()}">${formGroup.label()}</label>
                </div>            
                `;
            },
            radio: formGroup => {
                return this.templates.checkbox(formGroup);
            },
            submitBtn(buttonOptions) {
                return `
                    <div class="form-group">
                        <button class="btn btn-primary">${buttonOptions.html}</button>
                    </div>
                `;
            }
        });
    }

    /**
     * Submit button
     * 
     * @param string html
     * @returns string
     */
    submitBtn(html) {
        return this.templates.submitBtn({
            html,
        });
    }

    /**
     * Create new text input
     *
     */
    text(name, value, placeholder) {
        return this.node({
            type: 'text',
            placeholder,
            name,
            value,
        });
    }

    /**
     * Create new input file
     * 
     * @param string name
     * @returns FormNode 
     */
    file(name, label) {
        return this.node({
            type: 'file',
            name: name,
            label,
        });
    }

    /**
     * Create new image file input
     * 
     * @param string name
     * @param string imageUrl
     * @param string accepts
     * @return FormNode
     */
    image(name, imageUrl, label, accepts = '*') {
        return this.file(name, label).data('src', imageUrl).addClass('image-file-input').attr('accept', 'image/' + accepts);
    }

    /**
    * Create new email input
    *
    * @param string name
    * @param string label
    * @param string placeholder
    * @param string label
    */
    password(name, placeholder, label) {
        return this.node({
            type: 'password',
            label,
            placeholder,
            name,
        });
    }

    /**
    * Create new email input
    */
    email(name, value = '', placeholder, label) {
        return this.node({
            type: 'email',
            value,
            placeholder,
            label,
            name,
        });
    }

    /**
     * Create new textarea element
     *
     * @param string|object name
     * @param mixed value
     * @return jQuery object
     */
    textarea(name, value = '', placeholder, label) {
        return this.node({
            type: 'textarea',
            name,
            value,
            label,
            placeholder,
        });
    }

    /**
     * Create new select element
     *
     * @param string|object name
     * @return jQuery object
     */
    select(name, options, placeholder, label) {
        let selectNode = this.node({
            type: 'select',
            name,
            label,
            placeholder,
        });

        selectNode.addOptions(options);

        return selectNode;
    }

    /**
     * Create New Checkbox input
     */
    checkbox(name, value, checked, label) {
        let id = name + '_' + value;
        return this.node({
            type: 'checkbox',
            name,
            value,
            checked,
            label,
            id,
        });
    }

    /**
     * Create new datepicker input
     */
    datepicker(name, value, placeholder, label) {
        return this.node({
            type: 'text',
            value,
            placeholder,
            label,
            name,
            classes: ['datepicker'],
        });
    }

    /**
     * Create New Radio input
     */
    radio(name, value, checked, label = null) {
        let id = name + '_' + value;
        return this.node({
            type: 'radio',
            name,
            value,
            checked,
            label,
            id,
        });
    }

    /**
    * Make new input
    *
    */
    node(options) {
        return new FormGroup(options, this);
    }
}

DI.register({
    class: FormGroupBuilder,
    alias: 'formGroupBuilder',
});

// inject the formGroupBuilder object as getter property
// so it could be used like: formBuilder.groups.someMethod();
FormBuilder.extend('groups', () => {
    return DI.resolve('formGroupBuilder');
});
