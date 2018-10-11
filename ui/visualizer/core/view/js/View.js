// var View = (function () {

// })();
/**
 * ======= To Do =====
 * Change Detection
 * Modifiers => {{ text | stripTags }} Done
 * Directives => *for="name of names" Done
 * =======| To Do =====
 * Version: 1.2
 * View Syntax Features:
 *
 * f ( boolean expression(s) )
 * Some statements here
 *
 * elseif ( another boolean expression(s) )
 * Some statements here
 *
 * else
 * Some statements here
 *
 * endif
 *
 * for (...)
 * Some statements here
 *
 * endfor
 *
 * continue | break
 * You can also use `break` or `continue` in single line to stop or go to next iteration respectively
 *
 * Writing Custom Js Code
 * To write custom js code, it MUST BE encapsulated between `startJs` and `endJs`
 * i.e
 * startJs
 *  var name = 'H';
 *      name = 'zohdy';
 * endJs
 *  
 * Printing Js codes
 * TL;DR {{myJs}} OR ${myJs}
 *
 * ${js code here} or {{ js code here }}
 * Also jquery objects are printed automatically once you add it to the print statment
 * i.e {{ $('#my-element') }}
 *
 * Helpers
 * Helpers are extra functions that can be used in the view and it is always starts with @
 * Please note that only one helper can be passed in every line
 *
 *
 * To add some html attributes to html tag that are stored in object, just pass the @htmlAttr(object) at any position in the html tag
 * ie <h1 @htmlAttr({class: 'text-center', id: 'my-heading})>Hello World<h1>
 * Will be converted to <h1 class="text-center" id="my-heading">Hello World<h1>
*/
class View {
    /**
    * Constructor
    *
    */
    constructor(app) {
        this.app = app;
        _global('randomFunctionName', null);
        _global('classesList', null);
        _global('availableClasses', null);

        window.customFunctions = {};
        window.styleObject = {};

        this.prepareViews();

        _const('view', this.render.bind(this));

        this.observeCreatedFunctions();

        _const('render', (...args) => {
            // first argument is the view path that we will add the app name at the beginnign of it
            args[0] = Config.get('app.name') + '/' + args[0];
            return view(...args);
        });
    }

    /**
     * Get the content of the given view path
     * 
     * @param string viewPath
     * @returns string
     */
    get(viewPath) {
        return this.views.get(viewPath);
    }

    /**
     * Observe and clear the dead functions
     */
    observeCreatedFunctions() {
        // observe every minute
        let observeEvery = 60 * 1000;
        this.totalCleared = 0;
        setInterval(() => {
            for (let eventName in window.customFunctions) {
                let eventFunctions = window.customFunctions[eventName];
                for (let functionName in eventFunctions) {
                    if ($(`[${eventName}="${functionName}(this);"]`).length == 0) {
                        delete window.customFunctions[eventName][functionName];
                        delete window[functionName];
                        this.totalCleared++;
                    }
                }
            }
        }, observeEvery);
    }

    /**
     * Get original view code
     * 
     * @param string viewPath
     * @returns string
     */
    originalView(viewPath) {
        return __VIEWS__.get(viewPath);
    }

    /**
    * Start decoding views
    *
    */
    prepareViews() {
        this.views = new Map;

        for (let [viewPath, content] of __VIEWS__) {
            this.views.set(viewPath, this.compileView(content));
        }
    }

    /**
     * Adjust all required regular expressions before using it 
     */
    init() {
        // now lets list all available events list
        this.domEvents = [
            'abort',
            'animationend',
            'animationiteration',
            'animationstart',
            'blur',
            'canplay',
            'canplaythrough',
            'change',
            'click',
            'contextmenu',
            'copy',
            'cut',
            'dblclick',
            'drag',
            'dragend',
            'dragenter',
            'dragexit',
            'dragleave',
            'dragover',
            'dragstart',
            'drop',
            'durationchange',
            'emptied',
            'encrypted',
            'ended',
            'error',
            'focus',
            'focusin',
            'focusout',
            'hashchange',
            'input',
            'invalid',
            'keydown',
            'keypress',
            'keyup',
            'load',
            'loadeddata',
            'loadedmetadata',
            'loadstart',
            'mousedown',
            'mouseenter',
            'mouseleave',
            'mousemove',
            'mouseout',
            'mouseover',
            'mouseup',
            'paste',
            'pause',
            'play',
            'playing',
            'popstate',
            'progress',
            'ratechange',
            'reset',
            'resize',
            'scroll',
            'seeked',
            'seeking',
            'select',
            'stalled',
            'submit',
            'suspend',
            'timeupdate',
            'touchcancel',
            'touchend',
            'touchmove',
            'touchstart',
            'transitionend',
            'unload',
            'volumechange',
            'waiting',
            'wheel',
        ];

        this.eventsRegex = new RegExp(`\\((${this.domEvents.join('|')})\\)="([^"]*)`, 'gi');

        // boolean attributes
        let attributes = ['readonly', 'checked', 'selected', 'disabled', 'multiple'];
        this.attributesRegex = new RegExp(`\\[(${attributes.join('|')})\\]="([^"]*)"`, 'gi');

        // styles attributes
        // i.e [width]="50px" || [style]="objectOfStyles"
        let stylesAttributes = ['style', 'width', 'height', 'background', 'color', 'border'];
        this.stylesRegex = new RegExp(`\\[(${stylesAttributes.join('|')})\\]="([^"]*)"`, 'gi');

        // classes list
        this.classesListRegex = /\[class\]=\"([^\"]*)\"/gi;
    }

    /**
    * Convert the given view value to normal js code
    *
    * @param string content
    * @return string
    */
    compileView(content) {
        this.init();
        // remove html comments
        // content = content.replace(/<!--[\s\S]*?-->/g, '');

        // remove empty lines
        // content = content.replace(/^\s*$(?:\r\n?|\n)/gm, '');

        // replace {{}} to be ${}
        let regex = /(?:\{\{(.+?)\}\})+/g;
        content = content.replace(regex, "${$1}");

        // iterate over the given object and convert it to key="value" attributes
        regex = /(?:\[attrs\]\=\"(.+))\"/g;
        content = content.replace(regex, "${viewCompiler.objectToHtmlAttributes($1)}");

        // iterate over the given object and convert it to key="value" attributes
        regex = /(?:\@trans\((.+?)\))+/g;
        content = content.replace(regex, "${trans($1)}");

        // split all lines to be in array
        content = content.split('\n');

        let compiled = 'var htmlCode = `\n';

        let previousLineType = 'htmlStatement';

        for (let i = 0; i < content.length; i++) {
            let line = content[i],
                previousLine = i == 0 ? '' : content[i - 1].trim();

            let trimmedLine = line.trim();

            if (trimmedLine.startsWith('if') || trimmedLine.startsWith('for') || trimmedLine.startsWith('while')) {
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;\n';
                }

                compiled += line.rtrim() + ' {\n';
                previousLineType = 'controlStructureStart';
            } else if (trimmedLine.startsWith('else') || trimmedLine.startsWith('else if')) {
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;';
                }

                compiled += '} ' + line.trim() + ' {\n';
                previousLineType = 'elseStatement';
            } else if (['endif', 'endwhile', 'endfor'].includes(trimmedLine)) {
                // if the previous line was not an end for any of the following
                // so it means it was a string to be printed
                // so we will close that string before we add the } for end control structure
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;';
                }

                previousLineType = 'controlStructureEnd';

                compiled += '\n}\n';
            } else if (trimmedLine.startsWith('let') || trimmedLine.startsWith('var')) {
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;';
                }

                compiled += line.rtrim(';') + ';';

                previousLineType = 'varStatement';
            } else if (trimmedLine.startsWith('@js')) {
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;';
                }

                compiled += trimmedLine.replace(/^\@js\((.*)\)$/, '$1').rtrim(';') + ';';

                previousLineType = 'varStatement';
            } else if (trimmedLine.startsWith('@echo')) {
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;';
                }

                compiled += trimmedLine.replace(/^\@echo\((.*)\)$/, 'echo($1)').rtrim(';') + ';';

                previousLineType = 'varStatement';
            } else if (['continue', 'break'].includes(trimmedLine)) {
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;';
                }

                compiled += line.rtrim() + ";\n";

                previousLineType = 'varStatement';
            } else if (trimmedLine == 'startJs') {
                if (previousLineType == 'htmlStatement') {
                    compiled = compiled.rtrim();
                    compiled += '`;';
                }

                // get all next lines until the line equals to endJs
                let nextLine = content[++i];
                previousLineType = 'statement';

                while (nextLine) {
                    if (nextLine.trim() == 'endJs') {
                        previousLineType = 'statement';
                        break;
                    } else {
                        compiled += nextLine.rtrim() + '\n';
                        nextLine = content[++i];
                    }
                }
            } else {
                let needsToBeClosed = false;
                [line, compiled, needsToBeClosed] = this.directives(line, compiled, previousLineType);
                [line, compiled] = this.adjustSpecials(line, compiled, previousLineType);

                if (previousLineType != 'htmlStatement') {
                    // if the compiled code ends with } and the previous line starts with $
                    if (compiled.endsWith('}') && previousLine[0] == '$') {
                    } else {
                        if (previousLineType != null) {
                            compiled += 'htmlCode +=`\n';
                        }
                    }
                }

                previousLineType = 'htmlStatement';

                compiled += line;

                if (needsToBeClosed) {
                    compiled += "`; \n } ";
                    compiled += 'htmlCode += `';
                }
            }
        }

        if (previousLineType == 'htmlStatement') {
            compiled = compiled.rtrim();
            compiled += '`;';
        }

        return compiled;
    }

    /**
     * Compile special directives
     */
    directives(line, compiled, previousLineType) {
        let needsToBeClosed = false;
        line = line.replace(new RegExp('\\*(for|if|while)\\=\\"([^"]*)\\"', 'i'), function (matches, controlStructure, forText) {
            if (previousLineType == 'htmlStatement') {
                compiled += '`';
            }

            compiled += ";\n";
            needsToBeClosed = true;

            compiled += `${controlStructure}(${forText}) {`;

            compiled += "\n";
            if (previousLineType == 'htmlStatement') {
                compiled += 'htmlCode +=`';
            }

            return '';
        });

        return [line, compiled, needsToBeClosed];
    }

    /**
     * Adjust special functions|attributes in the line
     * 
     * @param string line
     * @param string compiled
     * @param string previousLineType
     * @returns array
     */
    adjustSpecials(line, compiled, previousLineType) {
        // update events
        line = line.replace(this.eventsRegex, function (matchedText, event, callbackText) {
            if (previousLineType == 'htmlStatement') {
                compiled += '`';
            }

            compiled += ";\n";

            compiled += "randomFunctionName = 'func' + Math.floor(Math.random() * 99999999999999);\n";

            // $el => the element dom object that may be used as special variable
            // i.e (click)="hide($el)"
            compiled += 'window[randomFunctionName] = function ($el) {' + callbackText + ' }.bind(scope);';
            compiled += 'if (! window.customFunctions.on' + event + ') window.customFunctions.on' + event + ' = {};';
            compiled += 'window.customFunctions.on' + event + '[randomFunctionName] = window[randomFunctionName]';

            compiled += "\n";
            if (previousLineType == 'htmlStatement') {
                compiled += 'htmlCode +=`';
            }

            return 'on' + event + '="${randomFunctionName}(this);';
        });

        // styles attributes
        // please note that this special attribute will override any style attribute in the line
        line = line.replace(this.stylesRegex, (matchedText, attribute, value) => {
            if (attribute == 'style') {
                if (previousLineType == 'htmlStatement') {
                    compiled += '`';
                }

                compiled += ";\n";
                compiled += `
                var styleObject = ${value};

                var styleText = 'style="';

                for (var key in styleObject) {
                    styleText += key + ':' + styleObject[key] + ';';    
                }

                styleText += '"';
                `;

                compiled += "\n";
                if (previousLineType == 'htmlStatement') {
                    compiled += 'htmlCode +=`';
                }

                return '${styleText}';
            } else {
                return `style="${attribute}:${value};"`;
            }
        });

        // update boolean attributes
        line = line.replace(this.attributesRegex, function (matchedText, attribute, booleanExpression) {
            return '${' + booleanExpression + ' ? "' + attribute + '" : ""}';
        });

        // classes list
        line = line.replace(this.classesListRegex, function (matchedText, objectText) {
            if (previousLineType == 'htmlStatement') {
                compiled += '`';
            }

            compiled += ";\n";

            compiled += `
                classesList = ${objectText};
                availableClasses = [];

                for (var className in classesList) {
                    if (classesList[className]) {
                        availableClasses.push(className);
                    }
                }

                availableClasses = availableClasses.join(' ');
            `;

            compiled += "\n";
            if (previousLineType == 'htmlStatement') {
                compiled += 'htmlCode +=`';
            }

            return '[class]="${availableClasses}"';
        });

        return [line, compiled];
    }

    /**
    * Render the given view path with its data
    *
    * @param string viewPath
    * @param object data
    * @param object scope
    */
    render(viewPath, data = {}, scope = this.app) {
        if (!this.views.has(viewPath)) {
            throw new Error(`Not Found view ${viewPath}`);
        }

        let content = this.get(viewPath);
        
        // let start = performance.now();

        let compiler = new ViewCompiler(viewPath, content, data, scope);

        // let end = performance.now();

        // echo(viewPath + ' -> ' + (end - start));

        return compiler.html;
    }
}

/**
* We've to render the html outside the class because we can't
* use 'this' for storing variables in extracting the data key
*
*/
class ViewCompiler {
    /**
    * Constructor
    *
    * @param string viewPath
    * @param string compiledCode
    * @param object data
    * @param object scope
    * @return string
    */
    constructor(viewPath, compiledCode, data, scope) {
        this.viewPath = viewPath;

        window.viewCompiler = this;

        // view modifiers
        compiledCode = compiledCode.replace(new RegExp('(\\$\\{([^\}]+)\\})', 'g'), function (...args) {
            if (args[2].includes(' | ')) {
                let [value, modifier] = args[2].split(' | ');
                value = value.trim();
                modifier = modifier.trim();

                if (typeof View.modifiers[modifier] == 'undefined') {
                    throw new Error(`Call to undefined modifier ${modifier} in ${viewPath}`);
                }

                return '${View.modifiers.' + modifier + '(' + value + ')}';
            }

            return args[0];
        });

        // execute js code
        let executedCode = `;(function (viewCompiler) {`;
        for (let key in data) {
            executedCode += `var ${key} = data.${key};`;
        }

        executedCode += compiledCode;
        executedCode += ';viewCompiler.html = htmlCode;}).call(scope, viewCompiler);';

        try {
            eval(executedCode);

            let html = $('<span />').html(this.html);

            // let id = 'v-' + $.app.random.id();

            // let timer = setInterval(() => {
            //     let selector = $('#' + id);
            //     if (selector.length == 0) return;

            //     // added classes
            //     selector.find('[\\[class\\]]').each(function () {
            //         $(this).addClass($(this).attr('[class]'));
            //         $(this).removeAttr('[class]');
            //     });

            //     selector.removeAttr('id');

            //     clearInterval(timer);
            // }, 10);

            // this.html = `<span id="${id}">${html.html()}</span>`;

            html.find('[\\[class\\]]').each(function () {
                $(this).addClass($(this).attr('[class]'));
                $(this).removeAttr('[class]');
            })

            this.html = html.html();
        } catch (e) {
            console.error(`Invalid View Syntax in view ${viewPath}`);
            window.data = data;
            window.scope = scope;
            let view = '// ' + viewPath + '\n';
            // view += compiledCode;
            // view += 'let data = window.tmpData;';
            view += executedCode;

            var s = document.createElement('script');
            s.appendChild(document.createTextNode(view));
            document.body.appendChild(s);

            document.body.removeChild(s);
        }
    }

    /**
     * Convert the given object to html attributes
     *
     * @param object object
     * @return string
     */
    objectToHtmlAttributes(object) {
        let html = '';

        for (let key in object) {
            let value = object[key];

            html += `${key}="${value}" `;
        }

        return html.trim();
    }
}

View.modifiers = {
    /**
     * remove whitespaces from string
     */
    trim: value => value.trim(),
    /**
     * Strip html tags
     * The `_s` function exists in helpers section
     */
    strip: value => _s(value),
    /**
     * Convert any html tag into html entities
     * The `_e` function exists in helpers section
     */
    escape: value => _e(value),
    /**
     * Translate modifier
     */
    translate: text => trans(text),
};

DI.register({
    class: View,
    alias: 'view',
});