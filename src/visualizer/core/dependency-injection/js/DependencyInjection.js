class DependencyInjection {
    /**
     * Register the given class
     * 
     * @param {object} classInfo 
     */
    static register(classInfo) {
        classInfo.dependencies = DI.getDependencies(classInfo.class);

        classInfo.className = classInfo.class.prototype.constructor.name;

        if (!classInfo.alias) {
            classInfo.alias = classInfo.className;
        }

        DI.aliasMap[classInfo.alias] = classInfo.className;

        DI.classesList[classInfo.className] = classInfo;
    }

    /**
     * Get class dependencies for the given class and its method
     * 
     * @param Class classInfo
     * @param string methodName
     * @returns array
     */
    static getDependencies(classInfo, methodName = 'constructor') {
        let methodPrototype = classInfo.prototype ? classInfo.prototype[methodName] : classInfo[methodName]

        if (!methodPrototype) return [];

        let regexExp = '';

        let methodText = methodPrototype.toString();

        // if the current class has no constructor method
        // then we will check if that class has a parent class
        // if so we will check if the parent has a constructor method
        if (methodName == 'constructor' && methodPrototype.name === classInfo.name && !methodText.includes('constructor')) {
            let parentText = DI.getParentText(classInfo);

            if (parentText) {
                methodText = parentText;
            }
        } else {
            //  es5
            let parent = DI.getParentClass(classInfo);

            if (parent && parent.constructor.name != 'Object') {
                let parentText = DI.getParentText(classInfo);

                if (!methodText.includes('function ' + classInfo.constructor.name) && parentText.includes('function ' + parent.constructor.name)) {
                    methodText = parentText;
                }
            }
        }

        // this condition is for es6
        if (methodText.includes('class ')) {
            regexExp += '(?:' + methodName + ')';
        } else {
            // this is for es5
            regexExp += '(?:function\\s+)?';
        }

        regexExp += '\\s*\\(([^\\)]*)\\)';

        let regex = new RegExp(regexExp),
            matches = methodText.match(regex);

        if (!matches || !matches[1]) return [];

        // now we will remove any spaces, tabs or new lines
        return matches[1].replace(/\t|\n|\s/g, '').replace(/,$/, '').split(',');
    }

    /**
     * Get Parent text
     * 
     * @param  class classInfo
     * @param  string method
     * @returns string  
     */
    static getParentText(classInfo, method = 'constructor') {
        classInfo = eval(classInfo);
        let parent = DI.getParentClass(classInfo),
            parentText = '';

        if (parent && parent.prototype) {
            parentText = parent.prototype[method].toString();
            if (parentText.includes(method)) {
                return parentText;
            } else {
                return DI.getParentText(parent, method);
            }
        }

        return '';
    }

    /**
     * Get parent class of the given class
     * 
     * @param  class targetClass
     * @returns parentClass|null
     */
    static getParentClass(targetClass) {
        let parent = Object.getPrototypeOf(eval(targetClass));

        return parent.name ? parent : null;
    }

    /**
     * Resolve the given alias or class name if it doesn't have an alias
     * Please Note that this method works as with the flow of the singleton pattern
     * So if you want to get new instance of the class, use the DI.instance method instead
     * 
     * @param string className 
     * @param string constructor 
     */
    static resolve(className, method = 'constructor') {
        if (typeof className === 'object') {
            let object = className;
            className = className.constructor.name;

            if (!DI.instances[className]) {
                DI.instances[className] = object;
            }
        } else {
            className = DI.aliasMap[className] || className;
        }

        if (typeof DI.instances[className] != 'undefined') {
            let object = DI.instances[className];

            if (method == 'constructor') return object;

            let dependencies = DI.getDependencies(object, method);

            return object[method](...DI.resolveDependencies(dependencies));
        }

        return DI.instances[className] = DependencyInjection.instance(className);
    }

    /**
     * Get new instance for the given class name
     * 
     * @param string className
     * @returns object
     */
    static instance(className) {
        className = DI.aliasMap[className] || className;

        let classInfo = DI.classesList[className];

        if (!classInfo) {
            // check if the class exists using the eval way
            // we will try to find that class, the eval way
            try {
                let dependencyClass = eval(className);

                if (typeof dependencyClass === 'function') {
                    DI.register({
                        class: dependencyClass,
                    });

                    classInfo = DI.classesList[className];
                }
            } catch (e) {
                throw new Error(`Dependency Injection Resolver: Call to undefined class or alias: ${className}`)
            }
        }

        try {
            let dependencies = DI.resolveDependencies(classInfo.dependencies);

            let object = new classInfo.class(...dependencies);

            return object;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Resolve the given dependencies list
     * 
     * @param array dependencies
     * @param object classInfo
     * @returns array
     */
    static resolveDependencies(dependencies) {
        let resolveDependencies = [];

        if (dependencies.length > 0) {
            for (let dependency of dependencies) {
                if (dependency === 'var_args') continue;
                try {
                    resolveDependencies.push(DI.resolve(dependency));
                } catch (e) {
                    // in case the dependency is no way available
                    // then we will try as last resort to find it in the window object
                    if (typeof window[dependency] != 'undefined') {
                        resolveDependencies.push(window[dependency]);
                    } else {
                        console.log(e);
                        throw new Error(`Dependency Injection Dependency: No dependencies found with that argument '${dependency}'`);
                    }
                }
            }
        }

        return resolveDependencies;
    }

    /**
     * Determine if the given `alias` or `className` is registered in the DI
     */
    static contains(className) {
        return Boolean(DI.aliasMap[className] || DI.classesList[className]);
    }
}

var DI = DependencyInjection;

// registered instances
DI.instances = {};
// registered classes => No instances yet
DI.classesList = {};
// map of aliases that refer to class
DI.aliasMap = {};

// shorthand method for DI.resolve
const use = DI.resolve;