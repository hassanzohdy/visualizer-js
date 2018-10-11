class MarkdownLivePreview {
    /**
     * Constructor
     * 
     * @param Markdown
     */
    constructor(markdown, modals, codeHighlighter) {
        this.markdown = markdown;
        this.modals = modals;
        this.codeHighlighter = codeHighlighter;
    }

    /**
     * Open a new live preview for the given selector
     * If there is no selector passed to the method
     * Then it will be automatically opened
     *
     * @param object options
     * @returns void
     */
    open(options) {
        if (options.input) {
            let $this = this;
            
            options.input = $(options.input);

            options.input.on('focus', function () {
                options.value = $(this).val(); // reset default value 
                $this.openLivePreview(options);
            });
        } else {
            this.openLivePreview(options);
        }
    }

    /**
     * Open live preview modal 
     */
    openLivePreview(options) {
        let $this = this;
        this.modals.open({
            id: 'markdown-live-preview-modal',
            animation: {
                show: 'fadeIn',
                hide: 'fadeOut',
            },
            style: {
                width: '99%',
                margin: '0.25rem auto',
            },
            content: view('plugins/markdown-extensions/live-preview/modal'),
            before: {
                open: (modal, modalElement) => {
                    if (options.value) {
                        let value = options.value;
                        modalElement.find('.markdown-text-preview').val(value);
                        let content = modalElement.find('.live-preview-content').html($this.markdown.render(value, Markdown.WITHOUT_CODE_STYLING));

                        $this.highlightCode(content);
                    }
                },
            },
            on: {
                load: (modal, modalElement) => {
                    modalElement.find('.markdown-text-preview').focus().on('change keyup', function () {
                        let value = $(this).val();

                        if (options.input) {
                            options.input.val(value);
                        }

                        if (options.onChange) {
                            options.onChange(value);
                        }

                        let content = modalElement.find('.live-preview-content').html($this.markdown.render(value, Markdown.WITHOUT_CODE_STYLING));

                        $this.highlightCode(content);
                    }).on('keydown', function (event) {
                        // add tab indent when user clicks on tab key
                        if (event.which === 9) {
                            var cIndex = this.selectionStart;
                            this.value = [this.value.slice(0, cIndex),//Slice at cursor index
                                "\t",                              //Add Tab
                            this.value.slice(cIndex)].join('');//Join with the end
                            event.stopPropagation();
                            event.preventDefault();                //Don't quit the area
                            this.selectionStart = cIndex + 1;
                            this.selectionEnd = cIndex + 1;            //Keep the cursor in the right index
                        }
                    });
                },
            },
        });
    }

    /**
     * Highlight code
     */
    highlightCode(selector) {
        this.codeHighlighter.render(selector, CodeHighlighter.BLOCKS_ONLY);
    }
}

DI.register({
    class: MarkdownLivePreview,
    alias: 'markdownLivePreview',
});