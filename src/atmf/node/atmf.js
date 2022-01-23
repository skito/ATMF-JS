import * as fs from 'fs'
import ATMFEngine from '../engine/engine.js'
import DateExtension from '../engine/ext/date.js'
import Strings from '../engine/ext/strings.js'

DateExtension.Register(ATMFEngine);
Strings.Register(ATMFEngine);


ATMFEngine.prototype.GetTemplate = function (name) {
    if (typeof this.templates[name] != 'undefined')
        return this.templates[name];
    else {
        this.DiscoverTemplate(name);
        return this.templates[name] || false;
    }
};
ATMFEngine.prototype.DiscoverTemplate = function (name) {

    for (const ext of this._templateDiscoveryExt) {
        var filePath = this._templateDiscoveryPath + '/' + name + '.' + ext;
        if (fs.existsSync(filePath)) {
            this.SetTemplate(name, fs.readFileSync(filePath));
            return true;
        }
        else console.warn("ATMF warning: Template " + filePath + ' does not exists!');
    }

    return false;
};

ATMFEngine.prototype.ResolveCultureResource = function (keyname) {

    const keynameNS = keyname.split('/');
    var path = this.GetCultureDiscoveryPath() + '/' + this.GetCulture();

    var keypath = '';
    var divider = '';
    for (const namespace of keynameNS) {
        if (namespace.indexOf('.') >= 0) {
            const nsParts = namespace.split('.');
            keypath += divider + nsParts[0];
        }
        else keypath += divider + namespace;
        divider = '/';
    }
    path += '/' + keypath;

    var translations = {};
    if (fs.existsSync(path + '.json')) {
        translations = JSON.parse(fs.readFileSync(path + '.json'));
    }

    var cultureResources = {};
    for (var key in translations)
    {
        var translation = translations[key];
        cultureResources[keypath + '.' + key] = translation;
    }

    return cultureResources;
};

ATMFEngine.prototype.Rend = function () {
    var output = this.GetTemplate('master') ?? this.GetTemplate('page');
    if (!output) {
        console.warn('ATMF master or page template must be set!');
        return '';
    }

    var redundancy = 0;
    output = '' + output;
    while (
        output.substr_count('{$') > output.substr_count('\\{$') ||
        output.substr_count('{@') > output.substr_count('\\{@') ||
        output.substr_count('{#') > output.substr_count('\\{#') ||
        output.substr_count('{/') > output.substr_count('\\{/')) {
        if (redundancy > this.redundancyLimit) {
            console.warn('ATMF Warning: Template redundancy limit has reached!');
            return '';
        }

        output = this.ParseMarkup(output);
        redundancy++;
    }

    // Replace escaped tags
    return output.replaceAll('\\{$', '{$').replaceAll('\\{@', '{@').replaceAll('\\{#', '{#').replaceAll('\\{/', '{/');
};


var ATMF = new ATMFEngine();
ATMF._globals = global;

global.ATMFEngine = ATMFEngine;
if (typeof global.ATMF == 'undefined') {
    global.ATMF = ATMF;
}
else console.warn('Global name "ATMF" is already occupied. You need to initialize it manually via ATMFEngine class.');

if (typeof global.__ == 'undefined') {
    global.__ = function (key, val) {
        if (global.ATMFEngine.latestInstance != null) {
            return global.ATMFEngine.latestInstance.__(key, val);
        }
        else console.error('No ATMF instances found.');
    };
}
else console.warn('Global name "__" for ATMF selector is already occupied. You might want to set that manually.');

if (typeof global.__escape == 'undefined') {
    global.__escape = function (str) {
        if (global.ATMFEngine.latestInstance != null)
            return global.ATMFEngine.latestInstance.__escape(str);
        else console.error('No ATMF instances found.');
    };
}
else console.warn('Global name "__escape" for ATMF escape function is already occupied. You might want to set that manually.');

// Remove All
/*var RemoveFromArr = function (arr, val) {
    var i = arr.indexOf(val);
    while (i >= 0) {
        arr.splice(i, 1);
        i = arr.indexOf(val);
    }
    return arr;
};*/

String.prototype.substr_count = function (search) {
    return this.split(search).length - 1;
};

export { ATMFEngine, ATMF as default };