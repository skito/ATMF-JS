class ATMFCulture {

    constructor() { }

    static ProcessTag(sender, tagName, args) {
        const keypath = tagName.substr(1);
        var realKeypath = keypath;

        var cultureResources = sender._cachedTranslations;
        if (typeof cultureResources[keypath] == 'undefined') {
            var hasAnAlias = false;
            for (var alias in sender._aliases) {
                var path = sender._aliases[alias];
                if (keypath.indexOf('.') >= 0 || alias != path) {
                    var parts = keypath.split('.');
                    if (parts[0] == alias) {
                        parts.splice(0,1);
                        realKeypath = path + '.' + parts.join('.');
                        hasAnAlias = true;
                    }
                }
                else if (typeof [path + '.' + keypath] != 'undefined') {
                    realKeypath = path + '.' + keypath;
                    hasAnAlias = true;
                }

                if (hasAnAlias) break;
            }

            if (!hasAnAlias) {
                cultureResources = { ...cultureResources, ...sender.ResolveCultureResource(keypath) };
                sender._cachedTranslations = cultureResources;
            }
        }

        if (typeof cultureResources[realKeypath] == 'undefined') return null;

        const resource = cultureResources[realKeypath];
        var translation = '';
        if (Array.isArray(resource)) {
            const plural = typeof args[0] != 'undefined' && IsNumeric(args[0]) && args[0] != 1;
            translation = !plural && typeof resource[1] != 'undefined' ? resource[1] : resource[0];
        }
        else translation = resource;

        for(var key in args)
        {
            const arg = args[key];
            translation = translation.replaceAll('$' + key, arg);
        }

        return translation;
    }

    static SetTag(sender, tagName, args, value) {
        const keypath = tagName.substr(1);
        sender._cachedTranslations[keypath] = value;
        return true;
    }

    static AddAlias(sender, alias, path) {
        if (typeof sender._aliases[alias] == 'undefined') {
            sender._aliases[alias] = path;
            sender._cachedTranslations = { ...sender._cachedTranslations, ...sender.ResolveCultureResource(path) };
        }
    }

    static ResetTranslations(sender) {
        sender._cachedTranslations = {};
        sender._aliases = {};
    }


};

function IsNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export { ATMFCulture as default } ;