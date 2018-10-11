class FormGroup extends FormNode {
    /**
     * Constructor
     * 
     * @param object attributes
     * @param FormGroupBuilder builder
     */
    constructor(attributes, builder) {
        if (attributes.label && ! attributes.placeholder) {
            attributes.placeholder = attributes.label;
        } else if (attributes.placeholder && ! attributes.label) {
            attributes.label = attributes.placeholder;
        }

        let input = FormNode.build(attributes);

        super(input);

        if (attributes.label) {
            this.labelHtml = attributes.label;
            delete attributes.label;
        }

        if (! attributes.classes) {
            this.node.addClass('form-control');
        }

        this.builder = builder;
    }

    /**
     * Set|Get form group label
     * 
     * @param string label
     * @returns mixed
     */
    label(label = null) {
        if (! Is.null(label)) {
            this.labelHtml = label;

            return this;
        }
        
        return this.labelHtml;
    }

    /**
     * {@inheritDoc}
     */
    toString() {
        let template = this.builder.templates[this.type()] || this.builder.templates['input'];
        
        return template(this);
    }
}