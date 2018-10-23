const { echo, fs, ROOT, UI_DIR, glob, watcher, APP_DIR, APP_NAME, BASE_URL } = require('./bootstrap');
const io = require('socket.io')(2020);
const exec = require('child-process-promise').exec;

const open = require('opn');

open(BASE_URL);

console.log('Server has started...');

const Parser = require('./compiler/Parser.js').Parser;

glob(APP_DIR + '/**/smart-views/**/*.html', (error, files) => {
    watch(files).on('all', (event, filePath) => {
        fs.readFile(filePath, 'UTF8', (errors, html) => {
            let parser = new Parser(html, filePath);

            parser.parse();
        });
    });
});

glob(ROOT + '/public/static/**/smart-views/**/*.js', (error, files) => {
    watch(files).on('all', (event, filePath) => {
        reloadApp();
    });
});

glob(UI_DIR + '/**/*.{scss,js}', (error, files) => {
    watch(files).on('all', (event, filePath) => {
        reloadApp();
    });
});


// rebuild the application on javascript creation
function reloadApp() {
    io.emit('reload');
}

watch(UI_DIR + '/**/js/*.js').on('add', (filePath) => {
    echo(`${filePath.removeFirst(UI_DIR)} has been created successfully`);
    rebuildApp();
}).on('unlink', filePath => {
    echo(`${filePath.removeFirst(UI_DIR)} has been removed successfully`);
    rebuildApp();
});
watch(UI_DIR + '/**/package.json').on('all', (filePath) => {
    rebuildApp().then(() => {
        reloadApp();
    });
});

function rebuildApp() {
    return new Promise((resolve, reject) => {
        exec(`php ${ROOT}/visualize build ${APP_NAME}`).then(result => {
            echo(result.stdout);
            reloadApp();
            resolve();
        }).catch(reject);
    });
}

function watch(path) {
    return watcher.watch(path, {
        ignoreInitial: true,
    });
}