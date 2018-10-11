class FormBuilder {
    /**
    * Constructor
    *
    * @param DomBuilder dom
    */
    constructor(dom) {
        this.dom = dom;
    }

    /**
    * Create new hidden input
    *
    * @param string name
    * @param mixed value
    */
    hidden(name, value = '') {
        let input = this.node({
            type: 'hidden',
            name: name,
            value: value,
        });

        return input;
    }

    /**
    * Create new text input
    *
    * @param string name
    * @param mixed value
    * @param mixed placeholder
    */
    text(name, value = '', placeholder = '') {
        return this.node({
            type: 'text',
            name: name,
            value: value,
            placeholder: placeholder,
        });
    }

    /**
     * Create new input file
     * 
     * @param string name
     * @returns FormNode 
     */
    file(name) {
        return this.node({
            type: 'file',
            name: name,
        });
    }

    /**
     * Create new image file input
     * 
     * @param string name
     * @param string accepts
     * @return FormNode
     */
    image(name, imageUrl = null, accepts = '*') {
        return this.file(name).data('src', imageUrl).addClass('image-file-input').attr('accept', 'image/' + accepts);
    }

    /**
    * Create new email input
    *
    * @param string name
    * @param mixed value
    * @param mixed placeholder
    */
    email(name, value = '', placeholder = '') {
        return this.node({
            type: 'email',
            name: name,
            value: value,
            placeholder: placeholder,
        });
    }

    /**
    * Create new password input
    *
    * @param string name
    * @param mixed value
    * @param mixed placeholder
    */
    password(name, placeholder = '') {
        return this.node({
            type: 'password',
            name: name,
            placeholder: placeholder,
        });
    }

    /**
     * Create new textarea element
     *
     * @param string|object name
     * @param mixed value
     * @return FormNode
     */
    textarea(name, value = '', placeholder) {
        return this.node({
            type: 'textarea',
            name,
            value,
            placeholder,
        });
    }

    /**
     * Create new select element
     *
     * @param string name
     * @param array options
     * @param string placeholder
     * @return FormNode
     */
    select(name, options, placeholder) {
        let selectNode = this.node({
            type: 'select',
            name,
            placeholder
        });

        selectNode.addOptions(options);

        return selectNode;
    }

    /**
    * Get new Select option
    *
    * @param mixed value
    * @param string html
    * @param bool selected
    */
    option(value, html, selected = false) {
        return this.dom.element('option', {
            value, html, selected,
        });
    }

    /**
     * Create New Checkbox input
     */
    checkbox(name, value, isChecked) {
        let id = name + '_' + value;
        return this.node({
            type: 'checkbox',
            checked: isChecked,
            name,
            id,
        });
    }

    /**
     * Create New Radio input
     */
    radio(name, value, isChecked) {
        let id = name + '_' + value;
        return this.node({
            type: 'radio',
            checked: isChecked,
            name,
            value,
            id,
        });
    }

    /**
    * Make new input
    *
    */
    node(attributes) {
        return new FormNode(FormNode.build(attributes));
    }

    /**
     * This method is used to extend the class dynamically
     * 
     * @param string name
     * @param callback callbackValue
     */
    static extend(name, callbackValue) {
        Object.getter(FormBuilder, name, callbackValue);
    }
}

DI.register({
    class: FormBuilder,
    alias: 'formBuilder',
});
