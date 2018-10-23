class HtmlCompiler {
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
        if (typeof element == 'undefined') return;

        if (element.constructor.name === 'Text') {
            this.textNode(element.nodeValue);
            return;
        }

        let tag = element.tagName.toLowerCase(),
            attributes = '',
            booleanAttributes = {};

        if (element.hasAttribute('*for')) {
            this.parsed += `for (${element.getAttribute('*for')}) {\n`;
            element.removeAttribute('*for');
            this.extract(element, "Random.id(5)", null);
            this.parsed += '}\n';
            return;
        } else if (element.hasAttribute('*if')) {
            this.parsed += `if (${element.getAttribute('*if')}) {\n`;
            element.removeAttribute('*if');
            this.extract(element);
            this.parsed += '}\n';
            return;
        } else if (element.hasAttribute('[style]')) {
            let styling = element.getAttribute('[style]');
            element.removeAttribute('[style]');
            attributes += `, 'style', ${styling}`;
        }

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
                element.removeAttribute(attribute.name);
                // attributes += `, '${attributeName}', ${value}`;
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
            elemtnVariable = `el${Random.string(3)}`;

        if (attributes) {
            this.parsed += this.line(`var ${elemtnVariable} = ${functionName}('${tag}', ${id}, ${staticAttributes}${attributes})`);
        } else {
            this.parsed += this.line(`var ${elemtnVariable} = ${functionName}('${tag}', ${id}, ${staticAttributes})`);
        }

        if (thereIsBooleanAttributes) {
            for (let attribute in booleanAttributes) {
                this.parsed += this.line(`${elemtnVariable}.${attribute} = ${booleanAttributes[attribute]}`);
            }
        }

        for (let child of element.childNodes) {
            if (child.constructor.name == 'Text') {
                this.textNode(child);
            } else {
                this.extract(child);
            }
        }

        if (functionName == 'elementOpen') {
            this.parsed += this.line(`elementClose('${tag}')`);
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

        if (nodeValue.includes('${') && nodeValue.includes('(') && typeof window == 'undefined') {
            nodeValue.split("\n").map(text => {
                this.parsed += this.line(`eval(buildHtml(\`${text}\`))`);
            });

            return '';
        }

        nodeValue.split("\n").forEach(text => {
            this.parsed += this.line(`text(\`${text}\`)`)
        });

        return '';
    }

    /**
     * Convert any {{ }} to ${}
     * 
     * @param   string text
     */
    convert(text) {
        let regex = /(?:\{\{(.+?)\}\})+/g;
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

if (typeof window == 'undefined') {
    global.HtmlCompiler = HtmlCompiler;
}