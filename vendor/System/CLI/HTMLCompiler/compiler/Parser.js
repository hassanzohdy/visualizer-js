const {echo, fs, path, ROOT, APP_NAME, JSDOM, APP_DIR, UI_DIR, random, FRAMEWORK_NAME} = require('./../bootstrap');

require(UI_DIR + '/visualizer/core/layout/smart-views/js/HtmlCompiler.js');
let a = require(UI_DIR + '/visualizer/random/js/Random.js');

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
      
        console.clear();

        echo(this.parsed);
        
        let fileContent = `SMART_VIEWS['${this.viewName}'] = function (data) {${this.parsed}};`;

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