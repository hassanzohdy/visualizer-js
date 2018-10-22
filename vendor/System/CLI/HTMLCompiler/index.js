const { echo, fs, path, ROOT, UI_DIR, glob, watcher, APP_DIR, APP_NAME, BASE_URL} = require('./bootstrap');
const io = require('socket.io')(2020);
const exec = require('child-process-promise').exec;

const open = require('opn');

open(BASE_URL);

console.log('Server has started...');

const Parser = require('./compiler/Parser.js').Parser;

glob(APP_DIR + '/**/smart-views/**/*.html', (error, files) => {
    watcher.watch(files, {
        ignoreInitial: true,
    }).on('all', (event, filePath) => {
        fs.readFile(filePath, 'UTF8', (errors, html) => {
            let parser = new Parser(html, filePath);

            parser.parse();
        });
    });
});

glob(ROOT + '/public/static/**/smart-views/**/*.js', (error, files) => {
    watcher.watch(files, {
        ignoreInitial: true,
    }).on('all', (event, filePath) => {
        reloadApp();
    });
});

glob(UI_DIR + '/**/*.{scss,js}', (error, files) => {
    watcher.watch(files, {
        ignoreInitial: true,
    }).on('all', (event, filePath) => {
        reloadApp();
    });
});


function reloadApp() {
    io.emit('reload');
}

// rebuild the application on javascript creation

let started = false;

let jsFiles = [];

glob(UI_DIR + '/**/*.js', (error, files) => {
    jsFiles = files;
});


watcher.watch(UI_DIR + '/**/js/*.js', {
    ignoreInitial: true,
}).on('add', (filePath) => {
    echo(`${filePath.removeFirst(UI_DIR)} has been created successfully`);
    rebuildApp();
}).on('unlink', filePath => {
    echo(`${filePath.removeFirst(UI_DIR)} has been removed successfully`);
    rebuildApp();
});
watcher.watch(UI_DIR + '/**/package.json', {
    ignoreInitial: true,
}).on('all', (filePath) => {
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