import { ATMFTag, ATMFExtensions } from './core/tag.js';
import ATMFVariables from './core/variables.js'
import ATMFCulture from './core/culture.js';

class ATMFEngine {

    static latestInstance = null;
    static extensions = ATMFExtensions;

    // Private properties
    #tags; #disableParsing; #openBlocks; #indexEach; #lastBlockID;

    // Private methods
    #ParsingIsEnabled; #DisableParsing; #EnableParsing; #CreateBlockID;

    constructor(linkGlobalSelectors = true) {

        if (linkGlobalSelectors)
            ATMFEngine.latestInstance = this;

        this.vars = [];
        this.eVars = [];
        this.redundancyLimit = 32;
        this.allowGlobals = false;
        this.templates = {};

        this._globals = {};
        this._cachedTranslations = {};
        this._aliases = {};
        this._templateDiscoveryExt = ['html', 'ptpl'];
        this._templateDiscoveryPath = '.';
        this._cultureDiscoveryPath = 'culture';
        this._currentCulture = 'en-US';

        this.#tags = [];
        this.#disableParsing = 0;
        this.#openBlocks = 0;
        this.#indexEach = [];
        this.#lastBlockID = 0;

        this._SetPrivateMethods();
    }

    _SetPrivateMethods() {
        this.#ParsingIsEnabled = function () {
            return this.#disableParsing == 0;
        };

        this.#DisableParsing = function () {
            this.#disableParsing++;
        };

        this.#EnableParsing = function () {
            if (this.#disableParsing > 0)
                this.#disableParsing -= 1;
        };

        this.#CreateBlockID = function () {
            this.#lastBlockID++;
            return this.#lastBlockID;
        };
    }

    ParseMarkup(str='') {

        // ATMF Tags
        var startPos = str.indexOf('{', 0);
        while (startPos >= 0) {

            // Skip escaping with backslash
            if (startPos > 0 && str.substr(startPos - 1, 2) == '\\{') {
                startPos = str.indexOf('{', startPos + 1);
                continue;
            }

            var blockStr = '';
            var blockMatch = false;
            var endPos = str.indexOf('}', startPos + 1);
            while (endPos >= 0) {
                blockStr = str.substr(startPos, endPos - startPos + 1);
                if (blockStr.substr_count('{') == blockStr.substr_count('}')) {
                    blockMatch = true;
                    break;
                }
                endPos = str.indexOf('}', endPos + 1);
            }

            if (!blockMatch) {
                console.error('ATMF Error: Closing curly bracket expected!');
                return;
            }
            else if (blockStr.length < 4) {
                console.error('ATMF Error: Empty curly brackets detected!');
                return;
            }

            // strip off top level brackets
            blockStr = blockStr.substr(1, blockStr.length - 2);


            // Parse special functions
            if (blockStr.indexOf('#each') == 0 || blockStr.indexOf('#if') == 0)
                this.#openBlocks++;

            if (blockStr.indexOf('#end') == 0) {
                if (typeof this.#indexEach[this.#openBlocks] != 'undefined') {
                    this.#EnableParsing();
                    delete this.#indexEach[this.#openBlocks];
                }
                this.#openBlocks--;
            }

            // Parse markup
            if (this.#ParsingIsEnabled()) {
                var doParseBlock = false;

                // Good idea for caching tag outputs
                // However this is causing issues with #if #else functions
                // Needs additional work
                // var blockID = btoa(blockStr);

                // No caching - every block, on it's own ID
                var blockID = this.#CreateBlockID();
                if (typeof this.#tags[blockID] == 'undefined') {
                    var tag = ATMFTag.ParseStr(blockStr);
                    if (tag != null) {
                        this.#tags[blockID] = tag;
                        doParseBlock = true;
                    }
                }
                else doParseBlock = true;

                if (doParseBlock)
                    str = str.substr(0, startPos) + '<%' + blockID + '%>' + str.substr(endPos + 1);
            }

            // Until the end of the last #each
            if (blockStr.indexOf('#each') == 0) {
                this.#DisableParsing();
                this.#indexEach[this.#openBlocks] = true;
            }

            startPos = str.indexOf('{', startPos + 1);
        }

        for (var id in this.#tags) {
            var tag = this.#tags[id];
            if (str.indexOf('<%' + id + '%>') >= 0)
                str = str.replaceAll('<%' + id + '%>', tag.Build(this));
        }
        
        // IF blocks, resulted by ATMF operations
        startPos = str.indexOf('<%:block_start%>', 0);
        while (startPos >= 0) {
            var blockStr = '';
            var blockMatch = false;

            var endPos = str.indexOf('<%:block_end%>', startPos + 1);
            while (endPos >= 0) {
                blockStr = str.substr(startPos, endPos - startPos + 14);
                if (blockStr.substr_count('<%:block_start%>') == blockStr.substr_count('<%:block_end%>')) {
                    blockMatch = true;
                    break;
                }
                endPos = str.indexOf('<%:block_end%>', endPos + 1);
            }

            if (!blockMatch) {
                console.error('ATMF Error: Closing function block expected!');
                return;
            }

            str = str.substr(0, startPos) + this.ParseBlocks(blockStr) + str.substr(endPos + 14);
            startPos = str.indexOf('<%:block_start%>', startPos);
        }

        return str;
    }

    ParseBlocks(blockStr) {
        if (blockStr.indexOf('<%:block_start%><%:show%>') >= 0) {
            return blockStr.substr(25, blockStr.length - 39);
        }
        else if (blockStr.indexOf('<%:block_start%><%:each%>') >= 0) {
            var resultStr = '';
            var str = blockStr.substr(25, blockStr.length - 39);
            
            var endTagPos = str.indexOf('%>');
            var eachTag = str.substr(3, endTagPos - 3);
            str = str.substr(endTagPos + 2);
            
            var eachArgs = eachTag.split(':');
            if (eachArgs.length == 2) {
                var collection = eachArgs[0].trim();
                var item = eachArgs[1].trim();
                
                var collectionArr = ATMFVariables.Select(this, collection);
                if (Array.isArray(collectionArr)) {
                    for (var i in collectionArr) {
                        var row = collectionArr[i];
                        var eVar = {};
                        eVar[item] = row;
                        
                        this.eVars.push(eVar);
                        resultStr += this.ParseMarkup(str);

                        if (this.eVars.length > 0)
                            this.eVars.pop();
                    }
                }
            }
            else resultStr = '';

            return resultStr;
        }

        return '';
    }

    GetTemplate(name) {
        if (typeof this.templates[name] != 'undefined') {
            return this.templates[name];
        }
        else return false;
    }

    SetTemplate(name, src) {
        this.templates[name] = src;
    }

    SetTemplateDiscoveryPath(path, ext = ['html', 'tpl']) {
        path = path.replace(/\/$/, "").replace(/\\$/, "");
        this._templateDiscoveryPath = path;
        this._templateDiscoveryExt = Array.isArray(ext) ? ext : [ext];
    }

    DiscoverTemplate(name) {
        console.error('ATMF Error: DiscoverTemplate prototype not defined!');
        return true;
    }

    SetCultureDiscoveryPath(path) {
        path = path.replace(/\/$/, "").replace(/\\$/, "");
        if (this._cultureDiscoveryPath != path) {
            this._cultureDiscoveryPath = path;
            ATMFCulture.ResetTranslations(this);
        }
    }

    GetCultureDiscoveryPath() {
        return this._cultureDiscoveryPath;
    }

    SetCulture(culture='') {
        if (culture != '' && this._currentCulture != culture) {
            this._currentCulture = culture;
            ATMFCulture.ResetTranslations(this);
        }
    }

    GetCulture() {
        return this._currentCulture;
    }

    ResolveCultureResource(keyname) {
        console.error('ATMF Error: ResolveCultureResource prototype not defined!');
        return true;
    }

    __(key, val) {
        var tag = ATMFTag.ParseStr(key);
        if (tag == null) return;

        if (val != null) tag.Set(this, val);
        else return tag.Build(this);
    }

    __escape(str) {
        var str = str.replaceAll('{', '&lcub;');
        str = str.replaceAll('}', '&rcub;');
        return str;
    }
};

String.prototype.substr_count = function (search) {
    return this.split(search).length - 1;
}

export {ATMFExtensions, ATMFEngine as default};



