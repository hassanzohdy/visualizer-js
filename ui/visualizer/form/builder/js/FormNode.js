class FormNode {
    /**
    * constructor
    *
    * @param object|jQuery attributes
    */
    constructor(node) {
        this.node = this.input = node;

        this.length = node.length;
    }

    /**
     * Add event listener to the current node
     * 
     * @param string event
     * @param callable callback
     * @returns this
     */
    on(event, callback) {
        this.node.on(...arguments);

        return this;
    }

    /**
     * Get node type
     */
    type() {
        let tag = this.node.prop('tagName').toLowerCase();

        if (['textarea', 'select'].includes(tag)) return tag;

        return this.attr('type');
    }

    /**
     * Filter nodes
     * 
     * @param string selector
     * @returns mixed
     */
    filter(selector) {
        return this.node.filter(selector);
    }

    /**
     * Add list of options to the form node if it is select tag
     * 
     * @param array options
     * @returns this
     */
    addOptions(options) {
        if (!Is.array(options)) return this;

        for (let option of options) {
            this.newOption(option);
        }

        return this;
    }

    /**
     * Add new option
     * 
     * @param mixed option
     * @returns jQuery object of the new added option
     */
    newOption(option) {
        if (Is.array(option)) {
            option = {
                text: option[0],
                value: option[1],
                selected: option[2] || false,
            };
        } else if (option === FormNode.DEFAULT_SELECT_OPTION) {
            // it means that we will add the `please-select` option
            // if the option is DEFAULT_SELECT_OPTION then it means we will set the text as `please-select`
            option = {
                value: '',
                text: trans('please-select'),
                disabled: true,
                readonly: true,
                selected: true,
            };
        } else if (Is.string(option)) {
            option = {
                value: option,
                text: trans(option),
            };
        }

        if (option.image) {
            this.addClass('imageable');
            option['data-image'] = option.image;
            delete option.image;
        }

        option = $('<option />', option);

        this.node.append(option);

        return option;
    }

    /**
     * Mark this node as a multiple selection 
     */
    multiple(multiple = true) {
        return this.attr('multiple', multiple);
    }

    /**
     * Mark the option for the given selected value as selected
     * 
     * @param string selectedValue
     * @returns this
     */
    selected(selectedValue) {
        if (Is.undefined(selectedValue)) return this;

        this.node.find(`option[value="${selectedValue}"]`).attr('selected', true);

        return this;
    }

    /**
     * Set/Get node id
     * 
     * @param string|undefined id
     * @returns this|string
     */
    id(id = undefined) {
        return this.attr('id', id);
    }

    /**
     * Add new data attribute
     * 
     * @param string name
     * @param string value
     * @returns this
     */
    data(name, value) {
        return this.attr('data-' + name, value);
    }

    /**
     * Make the node required
     * 
     * @param boolean required
     * @returns this
     */
    required(required = true) {
        return this.boolAttr('required', required);
    }

    /**
     * Make the node disabled
     * 
     * @param boolean disabled
     * @returns this
     */
    disabled(disabled = true) {
        return this.boolAttr('disabled', disabled);
    }

    /**
     * Make the node checked
     * 
     * @param boolean checked
     * @returns this
     */
    checked(checked = true) {
        return this.boolAttr('checked', checked);
    }
    
    /**
     * Set/Get node width
     * 
     * @param mixed width
     * @returns this|mixed
     */
    width(width = null) {
        return Is.null(width) ? this.node.width() : this.css('width', width);
    }

    /**
     * Set/Get node height
     * 
     * @param mixed height
     * @returns this|mixed
     */
    height(height = null) {
        return Is.null(height) ? this.node.height() : this.css('height', height);
    }

    /**
     * Check if the current node has the given boolean attribute
     * 
     * @param  string attribute
     * @returns boolean
     */
    is(attribute) {
        return this.node.is(':' + attribute);
    }

    /**
     * Make the node readonly
     * 
     * @param boolean readonly
     * @returns this
     */
    readonly(readonly = true) {
        return this.boolAttr('readonly', readonly);
    }

    /**
     * Add/Remove the given boolean attribute
     * 
     * @param   string attribute
     * @param   bool value
     * @returns this
     */
    boolAttr(attribute, value) {
        if (value) {
            this.node.prop(attribute, true);
        } else {
            this.node.removeAttr(attribute);
        }

        return this;
    }

    /**
     * Match the given input name 
     * 
     * @param string originalInput
     * @returns this
     */
    match(originalInput) {
        return this.attr('match', originalInput);
    }

    /**
     * set min value for the node
     * 
     * @param int value
     * @returns this
     */
    min(value) {
        return this.attr('min', value);
    }

    /**
     * set max value for the node
     * 
     * @param int value
     * @returns this
     */
    max(value) {
        return this.attr('max', value);
    }

    /**
     * set value length for the node
     * 
     * @param int value
     * @returns this
     */
    len(value) {
        return this.attr('length', value);
    }

    /**
     * Add classes to the node
     * 
     * @param string|array classes
     * @returns this
     */
    addClass(classes) {
        this.node.addClass(classes);
        return this;
    }

    /**
     * Add css to the node
     * 
     * @param string|object key
     * @param string|null value
     * @returns this
     */
    css(key, value = null) {
        this.node.css(key, value);
        return this;
    }

    /**
     * Add css to the node
     * 
     * @param string|object key
     * @param string|null value
     * @returns this
     */
    placeholder(placeholder) {
        return this.attr('placeholder', placeholder);
    }

    /**
     * Set|Get attribute to the node
     * 
     * @param string attr
     * @param string value
     * @returns this
     */
    attr(attr, value) {
        if (Is.undefined(value)) {
            return this.node.attr(attr);
        }

        this.node.attr(attr, value);

        return this;
    }
    
    /**
     * Set/Get value
     * 
     * @param mixed value
     * @returns mixed
     */
    val(value = null) {
        if (value) {
            this.node.val(value);
            return this;
        }

        return this.node.val().trim();
    }

    /**
     * Make the node printable
     * 
     * @returns string
     */
    toString() {
        return this.node.toString();
    }

    /**
     * Convert the given dot notation name to be valid html name attribute 
     *
     * @param string name
     * @returns string
     */
    static namable(name) {
        if (!name.includes('.')) return name;

        let namesList = name.split('.'),
            mainName = namesList.shift();

        for (let name of namesList) {
            mainName += `[${name}]`;
        }

        return mainName;
    }

    /**
     * Create new jQuery for the given attributes
     * 
     * @param object attributes
     * @returns jQuery
     */
    static build(attributes) {
        if (attributes.name && !attributes.id && Is.validHtmlId(attributes.name)) {
            attributes.id = attributes.name + '_' + Random.id();
        }

        let tag = 'input';

        if (['select', 'textarea'].includes(attributes.type)) {
            tag = attributes.type;
            delete attributes.type;
        }

        if (tag == 'textarea' && attributes.value) {
            attributes.html = attributes.value;
            delete attributes.value;
        }

        attributes.name = FormNode.namable(attributes.name);

        return DI.resolve('dom').element(tag, attributes);
    }
}

FormNode.DEFAULT_SELECT_OPTION = true;
