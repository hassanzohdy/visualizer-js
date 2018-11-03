exports.HtmlCompiler = class HtmlCompiler {
    /**
     * Constructor
     * 
     * @param  string html
     */
    constructor(html) {
        this.html = html.trim().replace(/this\./g, 'data.');

        this.html = this.convert(this.html);

        this.root = document.createElement('root');

        this.root.innerHTML = this.html;

        this.parsed = '';

        this.parse();
    }


    /**
     * Start parsing
     */
    parse() {
        for (let child of this.root.childNodes) {
            this.extract(child);
        }
    }

    /**
     * Extract elements
     * 
     * @param   HtmlElement element
     * @param   string id
     * @param   array staticAttributes
     * @returns void
     */
    extract(element, id = null, staticAttributes = null) {
        if (typeof element == 'undefined' || element.constructor.name == 'Comment') return;

        if (element.constructor.name === 'Text') {
            this.textNode(element.nodeValue);
            return;
        }

        let tag = element.tagName.toLowerCase(),
            attributes = '',
            booleanAttributes = {},
            conditionalClasses = '';

        if (tag === 'static') {
            this.staticHtml(element.innerHTML);
            return;
        }

        if (element.hasAttribute('*for')) {
            // combination between if and for in same element
            if (element.hasAttribute('*if')) {
                return this.controlStructure(element, 'if', '*if');
            }

            this.parsed += `for (${element.getAttribute('*for')}) {\n`;
            element.removeAttribute('*for');
            this.extract(element, "Random.id(5)", null);
            this.parsed += '}\n';
            return;
        } else if (element.hasAttribute('*if')) {
            return this.controlStructure(element, 'if', '*if');
        } else if (element.hasAttribute('*elseif')) {
            return this.controlStructure(element, 'else if', '*elseif');
        } else if (element.hasAttribute('*else')) {
            return this.controlStructure(element, 'else', null);
        } else if (element.hasAttribute('[style]')) {
            let styling = element.getAttribute('[style]');
            element.removeAttribute('[style]');
            attributes += `, 'style', ${styling}`;
        } else if (element.hasAttribute('[class]')) {
            conditionalClasses = element.getAttribute('[class]');
            element.removeAttribute('[class]');
        }

        if (tag == 'if') {
            if (!element.hasAttribute('condition')) {
                throw new Error('<if tag must have a condition attribute');
            }

            return this.controlStructure(element, 'if', 'condition', 'extractChildren');
        } else if (tag == 'elseif') {
            if (!element.hasAttribute('condition')) {
                throw new Error('<elseif tag must have a condition attribute');
            }

            return this.controlStructure(element, 'else if', 'condition', 'extractChildren');
        } else if (tag == 'else') {
            return this.controlStructure(element, 'else', null, 'extractChildren');
        }

        // if (tag != 'button')
        for (let attribute of element.attributes) {
            let attributeName = attribute.name,
                value = attribute.value;

            if (attribute.name.includes('(') && attribute.name.includes(')')) {
                attributeName = 'on' + attribute.name.replace(/\(|\)/g, '');
                value = `
                    function () {
                        var $el = this;
                        ${value}
                    }
                `.trim();

            } else if (attribute.name.includes('[') && attribute.name.includes(']')) {
                attributeName = attribute.name.replace(/\[|\]/g, '');
                booleanAttributes[attributeName] = `${value}`;
                continue;
            } else {
                value = `\`${value}\``;
            }
            attributes += `, \`${attributeName}\`, ${value}`;
        }

        if (id) {
            id = `${id}`;
        }

        let functionName = ['input', 'img', 'br', 'hr', 'link', 'meta'].includes(tag) ? 'elementVoid' : 'elementOpen',
            thereIsBooleanAttributes = Object.keys(booleanAttributes).length > 0,
            elementVariable = `el${Random.string(3)}`;

        if (attributes) {
            this.parsed += this.line(`var ${elementVariable} = ${functionName}('${tag}', ${id}, ${staticAttributes}${attributes})`);
        } else {
            this.parsed += this.line(`var ${elementVariable} = ${functionName}('${tag}', ${id}, ${staticAttributes})`);
        }

        if (thereIsBooleanAttributes) {
            for (let attribute in booleanAttributes) {
                this.parsed += this.line(`${elementVariable}.${attribute} = ${booleanAttributes[attribute]}`);
            }
        }

        if (conditionalClasses) {
            this.parsed += this.line(`${elementVariable}.conditionalClasses = ${conditionalClasses}`);
            this.parsed += `
                for (let className in ${elementVariable}.conditionalClasses) {
                    ${elementVariable}.classList.toggle(className, ${elementVariable}.conditionalClasses[className]);
                }  
            `;
        }

        this.extractChildren(element);

        if (functionName == 'elementOpen') {
            this.parsed += this.line(`elementClose('${tag}')`);
        }
    }

    /**
     * Create new control structure
     * 
     * @param   Element element
     * @param   string controlStructure
     * @param   string extractMOde => extract | extractChildren
     * @returns void
     */
    controlStructure(element, controlStructure, attributeName, extractMode = 'extract') {
        let condition = controlStructure != 'else' ? `(${element.getAttribute(attributeName)})` : '';
        this.parsed += `${controlStructure} ${condition} {\n`;
        element.removeAttribute(attributeName);
        this[extractMode](element);
        this.parsed += '}\n';
        return;
    }

    /**
     * Extract element children
     * 
     * @param   Element element
     * @returns void
     */
    extractChildren(element) {
        for (let child of element.childNodes) {
            if (child.constructor.name == 'Text') {
                this.textNode(child);
            } else {
                this.extract(child);
            }
        }
    }

    /**
     * Parse the given node as text node
     * 
     * @param   Node node
     */
    textNode(node) {
        let nodeValue = node.constructor.name == 'Text' ? node.nodeValue : node;

        nodeValue = nodeValue.trim();

        if (!nodeValue) return '';

        if (nodeValue.includes('@echo')) {
            nodeValue.replace(/@echo\((.*)\)/, (original, value) => {
                this.parsed += this.line(`console.log(${value})`);
            });
            return '';
        } else if (nodeValue.includes('${') && nodeValue.includes('(')) {
            this.staticHtml(nodeValue);
            return '';
        }

        nodeValue.split("\n").forEach(text => {
            this.parsed += this.line(`text(\`${text}\`)`)
        });

        return '';
    }

    /**
     * Add static html 
     * 
     * @param   string html
     * @returns void
     */
    staticHtml(html) {
        html = html.replace(/\`/g, '\\`');
        let elementVariable = `el${Random.string(4)}`;

        this.parsed += this.line(`var ${elementVariable} = elementOpen('html-blob')`);
        this.parsed += this.line(elementVariable + '.innerHTML = `' + html + '`');
        this.parsed += this.line('skip()');
        this.parsed += this.line(`elementClose('html-blob')`);
    }

    /**
     * Convert any {{ }} to ${}
     * 
     * @param   string text
     */
    convert(text) {
        let regex = /(?:\{\{(.+?)\}\})+/gm;
        return text.replace(regex, "${$1}");
    }

    /**
     * Add semi colon and new line after the given code
     * 
     * @param   string code
     * @returns string 
     */
    line(code) {
        return code + ';' + "\n";
    }
}