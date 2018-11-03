const fs = require('fs');
const echo = console.log;
const watcher = require('chokidar');
const glob = require('glob');
const path = require('path');
const ROOT = process.argv[2].replace(/\\/g, '/');
const APP_NAME = process.argv[3];
const BASE_URL = process.argv[4];
const SRC_DIR = ROOT + '/src';
const APP_DIR = SRC_DIR + '/apps/' + APP_NAME;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

require(SRC_DIR + '/visualizer/support/javascript/String/ltrim');
require(SRC_DIR + '/visualizer/support/javascript/String/rtrim');
require(SRC_DIR + '/visualizer/support/javascript/String/trim');
require(SRC_DIR + '/visualizer/support/javascript/String/removeFirst');
require(SRC_DIR + '/visualizer/support/javascript/String/removeLast');
require(SRC_DIR + '/visualizer/support/javascript/String/replaceFirst');
require(SRC_DIR + '/visualizer/support/javascript/String/replaceLast');


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
    APP_NAME, ROOT, SRC_DIR, APP_DIR, BASE_URL,
    JSDOM, FRAMEWORK_NAME,
    random,
};