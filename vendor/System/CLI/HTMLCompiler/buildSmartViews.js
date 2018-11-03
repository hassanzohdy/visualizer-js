const { echo, fs, ROOT, SRC_DIR, watcher, APP_DIR, APP_NAME, glob, BASE_URL } = require('./bootstrap');

const Parser = require('./compiler/Parser.js').Parser;

fs.readFile(`${ROOT}/vendor/System/storage/visualizer/${APP_NAME}.json`, 'UTF8', (e, file) => {
    let js = JSON.parse(file);

    let paths = Object.values(js.packages);

    for (let path of paths) {
        glob(ROOT + '/' + path + '/**/smart-views/*.html', (e, files) => {
            for (let filePath of files) {
                filePath = filePath.replace(/\\/g, '/');
                fs.readFile(filePath, 'UTF8', (errors, html) => {
                    let parser = new Parser(html, filePath, Parser.PRODUCTION_MODE);

                    parser.parse();
                });
            }
        });
    }
});