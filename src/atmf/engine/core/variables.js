class ATMFVariables {

    constructor() {
    }

    static ProcessTag(sender, tagName, args) {
        var varname = tagName.substr(1);
        var str = ATMFVariables.Select(sender, varname);

        for (var a in args) {
            var arg = args[a];
            if (arg.substr(0, 1) == '$') {
                varname = arg.substr(1);
                str += ATMFVariables.Select(sender, varname);
            }
            else str += arg;
        }

        return str;
    }

    static SetTag(sender, tagName, args, value) {
        var varname = tagName.substr(1);
        sender.vars[varname] = value;
        return true;
    }

    static Select(sender, varname) {
        var varRef = { value: null};
        var isAssigned = false;
        for (var i = sender.eVars.length; i > 0; i--) {
            var eVars = sender.eVars[i - 1];
            if (ATMFVariables.SelectQuery(eVars, varname, varRef)) {
                isAssigned = true;
                break;
            }
        }

        if (!isAssigned) {
            if (ATMFVariables.SelectQuery(sender.vars, varname, varRef)) { }
            else if (sender.allowGlobals && ATMFVariables.SelectQuery(sender._globals, varname, varRef)) { }
        }

        return varRef.value;
    }

    static SelectQuery(collection, selector, varRef) {
        if (typeof selector == 'string') selector = selector.split('.');
        if (selector.length > 1) {
            var newCollection = typeof collection[selector[0]] == 'object' ? collection[selector[0]] : null;
            if (newCollection != null) {
                delete selector[0];
                return ATMFVariables.SelectQuery(newCollection, selector.filter(Boolean), varRef);
            }
            else return false;
        }
        else {
            varRef.value = collection[selector[0]] || '';
            return typeof collection[selector[0]] != 'undefined';
        }
    }
}

export default ATMFVariables;