import ATMFFunctions from './functions.js'
import ATMFCulture from './culture.js'
import ATMFVariables from './variables.js'
import ATMFExtensions from './extensions.js'


class ATMFTag {

    constructor(name = '', args = []) {
        this.name = name;
        this.args = args;
    }

    BuildArgValues(sender) {
        var argValues = [];
        for (var a in this.args) {
            var arg = this.args[a];
            argValues.push(typeof arg == 'object' ? arg.Build(sender) : arg);
        }

        return argValues;
    }

    Build(sender) {
        var argValues = this.BuildArgValues(sender);
        
        switch (this.name.substr(0, 1)) {
            case '#':
                return ATMFFunctions.ProcessTag(sender, this.name, argValues);
            case '@':
                return ATMFCulture.ProcessTag(sender, this.name, argValues);
            case '$':
                return ATMFVariables.ProcessTag(sender, this.name, argValues);
            case '/':
                return ATMFExtensions.ProcessTag(sender, this.name, argValues);
            default:
                return '';
        }
    }

    Set(sender, value) {
        var argValues = this.BuildArgValues(sender);
        switch (this.name.substr(0, 1)) {
            case '#':
                return ATMFFunctions.SetTag(sender, this.name, argValues, value);
            case '@':
                return ATMFCulture.SetTag(sender, this.name, argValues, value);
            case '$':
                return ATMFVariables.SetTag(sender, this.name, argValues, value);
            case '/':
                return ATMFExtensions.SetTag(sender, this.name, argValues, value);
            default:
                return '';
        }
    }

    static ParseStr(str = '') {
        if (str.length < 2 || !['#', '@', '$', '/'].includes(str.substr(0, 1)))
            return null;
        
        var cmdMatches = str.match(/(\{(.*)\}|"(.*)"|\s?([a-z0-9\.\$\@\#\/_\-\!\|\&]+)(?:\s+|$))/gim);
        var tag = new ATMFTag();
        tag.name = str.split(' ')[0];
        for (var key in cmdMatches) {
            var match = cmdMatches[key];
            if (key > 0) {
                var resolve = !['#use', '#if', '#elseif', '#each'].includes(tag.name);
                if (match.substr(0, 1) == '"') {
                    tag.args.push(match.trimChars('"'));
                }
                else if (match.substr(0, 1) == '{') {
                    tag.args.push(ATMFTag.ParseStr(match.trimChars('\{\}')));
                }
                else if (['#', '@', '$', '/'].includes(match.substr(0, 1))) {
                    var cmd = match.substr(0, 1) == ' ' ? match.substr(1) : match;
                    tag.args.push(resolve ? ATMFTag.ParseStr(cmd) : cmd);
                }
                else {
                    tag.args.push(match.trim());
                }
            }
        }

        return tag;
    }

}


String.prototype.trimChars = function (charlist) {
    if (typeof charlist != 'string')
        return this.trim();

    return this.replace(new RegExp('^[' + charlist + ']+'), '').replace(new RegExp('['+ charlist + ']+$'), '');
};

export {ATMFExtensions, ATMFTag};