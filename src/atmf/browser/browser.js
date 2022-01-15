// Import Engine
import ATMFEngine from '../engine/engine.js'
import DateExtensions from '../engine/ext/date.js'

DateExtensions.Register(ATMFEngine);

ATMFEngine.prototype._observations = [];
ATMFEngine.prototype._mutationObserver = new MutationObserver(function (mutationsList, observer) {
    if (ATMF instanceof ATMFEngine) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                if (mutation.attributeName == 'data-atmf') {
                    ATMF.SetContents(mutation.target);
                }
            }
            else if (mutation.type == 'childList') {
                for (const node of mutation.removedNodes) {
                    if (ATMF._observations.includes(node)) {
                        RemoveFromArr(ATMF._observations, node);
                    }
                }

                for (const node of mutation.addedNodes) {
                    if (typeof node.dataset == 'undefined') continue;
                    if (typeof node.dataset.atmf == 'undefined') continue;
                    if (!ATMF._observations.includes(node)) {
                        ATMF.ObserveElement(node);
                        ATMF.SetContents(node);
                    }
                }
            }
        }
    }
});
ATMFEngine.prototype.ObserveElement = function (element) {
    if (typeof element.dataset == 'undefined')
        return;

    var src = element.dataset.atmf || '';
    if (src == '') return;

    if (src.indexOf('{#template #inline}') >= 0) {
        var template = '';
        var topNode = element.children.length > 0 ? element.children[0] : null;
        template = topNode != null ? topNode.textContent : element.textContent;
        element.dataset.atmf = src.replaceAll('{#template #inline}', template);
    }

    this._observations.push(element);
    this._mutationObserver.observe(element, { attributes: true });
};
ATMFEngine.prototype.Rebuild = function (atmf) {
    var rebuildAll = (typeof atmf == 'undefined');
    for (var i in this._observations) {
        var element = this._observations[i];
        var doRebuild = false;
        if (rebuildAll) doRebuild = true;
        else {
            var components = atmf.replaceAll('}', '').replaceAll('{', '').split(' ');
            for (var c in components) {
                if (element.dataset.atmf.indexOf(components[c]) >= 0) {
                    doRebuild = true;
                    break;
                }
            }
        }

        if (doRebuild)
            ATMF.SetContents(element);
    }
};
ATMFEngine.prototype.SetContents = function (target) {
    if (typeof target.dataset == 'undefined') return;

    var output = ATMF.ParseMarkup(target.dataset.atmf || '');
    if (typeof target.value != 'undefined')
        target.value = output;
    else if (typeof target.src != 'undefined')
        target.src = output;
    else if (typeof target.innerHTML != 'undefined')
        target.innerHTML = output;
    else if (typeof target.innerTEXT != 'undefined')
        target.innerTEXT = output;
};
ATMFEngine.prototype.GetTemplate = function (name) {
    if (typeof this.templates[name] != 'undefined')
        return this.templates[name];
    else {
        this.DiscoverTemplate(name).then((name) => {
            this.Rebuild('#template ' + name);
        });
        return false;
    }
};

ATMFEngine.prototype.templateDiscoveryPath = '';
ATMFEngine.prototype.DiscoverTemplate = function (name) {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.addEventListener("load", () => {
            this.SetTemplate(name, request.responseText);
            resolve(name);
        });
        request.addEventListener("error", () => {
            reject(name);
        });
        request.open('GET', this.templateDiscoveryPath + name + '.html');
        request.send();
    });
};

window.ATMFEngine = ATMFEngine;
if (typeof window.ATMF == 'undefined') {
    window.ATMF = new ATMFEngine();
    window.ATMF._globals = window;
    window.addEventListener('load', function (e) {
        var elements = window.document.body.getElementsByTagName("*");
        window.ATMF._mutationObserver.observe(document.body, { childList: true, subtree: true });
        for (var i in elements) {
            window.ATMF.ObserveElement(elements[i]);
        }
        ATMF.Rebuild();
    });
}
else console.warn('Global name "ATMF" is already occupied. You need to initialize it manually via ATMFEngine class.')

if (typeof window.__ == 'undefined') {
    window.__ = function (key, val) {
        if (window.ATMFEngine.latestInstance != null) {
            var result = window.ATMFEngine.latestInstance.__(key, val);
            if (typeof val != 'undefined')
                window.ATMFEngine.latestInstance.Rebuild(key);

            return result;
        }
        else console.error('No ATMF instances found.');
    };
}
else console.warn('Global name "__" for ATMF selector is already occupied. You might want to set that manually.');

if (typeof window.__escape == 'undefined') {
    window.__escape = function (key, val) {
        if (window.ATMFEngine.__escape != null)
            return window.ATMFEngine.latestInstance.__escape(str);
        else console.error('No ATMF instances found.');
    };
}
else console.warn('Global name "__escape" for ATMF escape function is already occupied. You might want to set that manually.');

// Remove All
var RemoveFromArr = function (arr, val) {
    var i = arr.indexOf(val);
    while (i >= 0) {
        arr.splice(i, 1);
        i = arr.indexOf(val);
    }
    return arr;
};