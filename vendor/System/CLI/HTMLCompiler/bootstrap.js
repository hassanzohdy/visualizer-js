const fs = require('fs');
const echo = console.log;
const watcher = require('chokidar');
const glob = require('glob');
const path = require('path');
const ROOT = process.argv[2].replace(/\\/g, '/');
const APP_NAME = process.argv[3];
const BASE_URL = process.argv[4];
const UI_DIR = ROOT + '/ui';
const APP_DIR = UI_DIR + '/apps/' + APP_NAME;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

require(UI_DIR + '/visualizer/support/javascript/String/ltrim');
require(UI_DIR + '/visualizer/support/javascript/String/rtrim');
require(UI_DIR + '/visualizer/support/javascript/String/trim');
require(UI_DIR + '/visualizer/support/javascript/String/removeFirst');
require(UI_DIR + '/visualizer/support/javascript/String/removeLast');
require(UI_DIR + '/visualizer/support/javascript/String/replaceFirst');
require(UI_DIR + '/visualizer/support/javascript/String/replaceLast');


function random(length = 32) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const FRAMEWORK_NAME = 'visualizer';

module.exports = {
    fs, echo, watcher, glob, path, 
    APP_NAME, ROOT, UI_DIR, APP_DIR, BASE_URL,
    JSDOM, FRAMEWORK_NAME,
    random,
};