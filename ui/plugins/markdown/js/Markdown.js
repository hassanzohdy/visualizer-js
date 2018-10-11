class Markdown {
    /**
     * Constructor
     */
    constructor(modals, codeHighlighter) {
        this.markdown = new showdown.Converter({
            simpleLineBreaks: true,
            tables: true,
            extensions: Markdown.extensionsList,
        });

        this.options = Config.get('markdown');
 
        this.blacklistTags = Object.get(this.options, 'blacklistTags') || [
            'script',
        ];
        this.whitelistTags = Object.get(this.options, 'whitelistTags') || [
            'kbd',
        ];
    }

    /**
     * Render the given html
     * 
     * @param string html
     * @param bool withCodeStyling
     * @returns string
     */
    render(html, withCodeStyling = Markdown.WITH_CODE_STYLING) {
        html = $('<div />').html(html);
        
        // whitelist tags
        html.find('*').not(this.whitelistTags.join(' ')).remove();
        html = this.markdown.makeHtml(html.html());

        showdown.extension('keyboardKey', {
            type: 'lang',
            // regex: /\{([^\}]+)\}/g,
            regex: /okek/g,
            // replace: "<key>$1</key>",
            replace: (...args) => {
                echo(args)
            },
        });

        html = $('<span />').html(html);

        // remove any script tags
        // html.find(this.blacklistTags.join(',')).each(function () {
        //     $(this).remove();
        // });

        let children = html.find('*');

        let domEvents = DI.resolve('view').domEvents;

        // remove any attached events
        children.each(function () {
            for (let event of domEvents) {
                $(this).removeAttr('on' + event);
            }
        });

        // add inlined-code class to any code tag that is just one line
        html.find('code').each(function () {
            if (!$(this).html().includes('\n')) {
                $(this).addClass('inlined-code');
            }
        });

        let classes = ['markdown-container'];

        if (withCodeStyling == Markdown.WITH_CODE_STYLING) {
            classes.push('codable');
        }

        return `<div class="${classes.join(' ')}">${html.html()}</div>`;
    }

    /**
     * Register new extension
     * 
     * @param string extensionName
     * @param object extension
     */
    static extension(extensionName, extension) {
        extension.name = extensionName;
        Markdown.extensionsList.push(extension);
    }
}

DI.register({
    class: Markdown,
    alias: 'markdown',
});

Markdown.extensionsList = [];
Markdown.WITH_CODE_STYLING = true;
Markdown.WITHOUT_CODE_STYLING = false;
