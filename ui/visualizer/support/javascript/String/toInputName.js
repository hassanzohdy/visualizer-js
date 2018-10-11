/**
 * Convert the current a dot notation string to compound input name
 * i.e
 * string = my.input.name
 * return => my[input][name]
 */
String.prototype.toInputName = function() {
    let string = this;

    if (! string.includes('.')) return string;

    let namesList = string.split('.'),
        mainName = namesList.shift();

    for (let name of namesList) {
        mainName += `[${name}]`;
    }

    return mainName;
};