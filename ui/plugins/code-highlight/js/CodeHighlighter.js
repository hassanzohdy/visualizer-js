class CodeHighlighter {
    constructor() {
        hljs.initHighlightingOnLoad();

        let themesList = [
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/agate.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/androidstudio.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/arduino-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/arta.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ascetic.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-cave-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-cave-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-dune-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-dune-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-estuary-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-estuary-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-forest-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-forest-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-heath-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-heath-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-lakeside-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-lakeside-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-plateau-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-plateau-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-savanna-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-savanna-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-seaside-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-seaside-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-sulphurpool-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-sulphurpool-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/brown-paper.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/brown-papersq.png",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/codepen-embed.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/color-brewer.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darcula.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/darkula.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/docco.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/dracula.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/far.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/foundation.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github-gist.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/googlecode.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/grayscale.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/gruvbox-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/gruvbox-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/hopscotch.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/hybrid.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/idea.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ir-black.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/kimbie.dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/kimbie.light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/magula.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/mono-blue.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai-sublime.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/monokai.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/obsidian.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/ocean.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/paraiso-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/paraiso-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/pojoaque.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/purebasic.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/qtcreator_dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/qtcreator_light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/railscasts.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/rainbow.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/routeros.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/school-book.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/school-book.png",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/solarized-dark.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/solarized-light.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/sunburst.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-blue.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-bright.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night-eighties.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow-night.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/vs.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/vs2015.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/xcode.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/xt256.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/zenburn.min.css",
        ];

        this.themesList = {};

        for (let themeUrl of themesList) {
            let themeName = themeUrl.split('/').pop().split('.').shift();

            this.themesList[themeName] = themeUrl;
        }

        this.style = $('<link />').attr({
            id: 'style',
            rel: 'stylesheet',
            href: this.themesList[Config.get('codeHighlight.theme') || 'vs2015'],
        }).appendTo('head');
    }

    /**
     * Render the given selector and parse the `code` tag
     * 
     * @param string selector
     */
    render(selector, blocksOnly = false) {
        $(selector).find('code').each(function (i, code) {
            if (blocksOnly && ! $(code).html().includes('\n')) return;
            hljs.highlightBlock(code);
        });
    }
}

DI.register({
    class: CodeHighlighter,
    alias: 'codeHighlighter',
});

CodeHighlighter.ANY_TYPE = false;
CodeHighlighter.BLOCKS_ONLY = true;
