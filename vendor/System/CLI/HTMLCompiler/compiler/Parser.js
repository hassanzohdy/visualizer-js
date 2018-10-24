const { echo, fs, path, ROOT, APP_NAME, JSDOM, APP_DIR, UI_DIR, random, FRAMEWORK_NAME } = require('./../bootstrap');

require(UI_DIR + '/visualizer/random/js/Random.js');
const HtmlCompiler = require('./HtmlCompiler').HtmlCompiler;
const minify = require("babel-minify");

exports.Parser = class Parser {
    constructor(html, filePath) {
        const dom = new JSDOM(html);

        this.prepareViewName(filePath);

        echo(`Recompiling ${this.viewName}`);

        this.filename = path.basename(filePath).rtrim('.html');

        global.document = dom.window.document;

        this.html = html;
    }

    parse() {
        let htmlCompiler = new HtmlCompiler(this.html);

        this.parsed = htmlCompiler.parsed;

        if (! this.parsed) {
            return this.parse();
        }

        console.clear();

        // the try-catch block MUST BE removed in production to reduce size
        let fileContent = `
            SMART_VIEWS['${this.viewName}'] = function (data) {
                try {
                ${this.parsed}
            } catch(e) {
                console.error(\`View Error in ${this.viewName}\`)
                console.error(e.message.replace(/data\./g, 'this.')); 
                throw new SyntaxError(\`${this.html}\`);
            }
        };
        `.trim();

        // fileContent = minify(fileContent).code;

        fs.writeFile(`${ROOT}/public/static/${APP_NAME}/smart-views/${this.viewName.replace(/\//g, '-')}.js`, fileContent, 'utf8', () => {
            echo(`${this.viewName} has been compiled successfully`);
        });
    }

    prepareViewName(filePath) {
        filePath = filePath.ltrim(UI_DIR).trim('/');

        if (filePath.includes(FRAMEWORK_NAME)) {
            filePath = filePath.replace(new RegExp(FRAMEWORK_NAME), '');
        } else {
            filePath = filePath.removeFirst(`apps/${APP_NAME}/components`);

            // prepend the app name at the beginning
            filePath = APP_NAME + filePath;
        }

        this.viewName = filePath.trim('/').removeLast('.html').replace('smart-views/', '');
    }
}