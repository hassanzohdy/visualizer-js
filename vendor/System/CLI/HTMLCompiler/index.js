const { echo, fs, ROOT, SRC_DIR, watcher, APP_DIR, APP_NAME, BASE_URL } = require('./bootstrap');
const io = require('socket.io')(2020);
const exec = require('child-process-promise').exec;

process.on('exit', () => {
    io.disconnect(0);
});

const open = require('opn');

open(BASE_URL);

console.log('Server has started...');

const Parser = require('./compiler/Parser.js').Parser;

watch(APP_DIR + '/**/smart-views/**/*.html').on('all', (event, filePath) => {
    filePath = filePath.replace(/\\/g, '/');
    fs.readFile(filePath, 'UTF8', (errors, html) => {
        let parser = new Parser(html, filePath);

        parser.parse();
    });
});

watch(ROOT + '/public/static/**/smart-views/**/*.js').on('all', (event, filePath) => {
    reloadApp();
});

watch(SRC_DIR + '/**/*.{scss,js}').on('all', (event, filePath) => {
    reloadApp();
});


watch(SRC_DIR + '/**/js/*.js').on('add', filePath => {
    echo(`${filePath.removeFirst(SRC_DIR)} has been created successfully`);
    rebuildApp();
}).on('unlink', filePath => {
    echo(`${filePath.removeFirst(SRC_DIR)} has been removed successfully`);
    rebuildApp();
});

watch(SRC_DIR + '/**/html/*.html').on('change', () => {
    reloadApp();
});

watch(SRC_DIR + '/**/package.json').on('all', filePath => {
    rebuildApp().then(reloadApp);
});

function rebuildApp() {
    return new Promise((resolve, reject) => {
        exec(`php ${ROOT}/visualize build ${APP_NAME} --withoutSmartViews`).then(result => {
            echo(result.stdout);
            reloadApp();
            resolve();
        }).catch(reject);
    });
}

console.reset = function () {
    return process.stdout.write('\033c');
  };

function watch(path) {
    return watcher.watch(path, {
        ignoreInitial: true,
    });
}

// rebuild the application on javascript creation
function reloadApp() {
    io.emit('reload');
}
