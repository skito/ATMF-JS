class ATMFExtensions {

    static #extensions = [];

    static Register(name, handler) {
        if (name.trim() == '') {
            console.error('ATMF extension handler must have a name!');
            return;
        }

        if (typeof handler == 'object' &&
            typeof handler.Set == 'function' &&
            typeof handler.Get == 'function') {
            ATMFExtensions.#extensions[name.trim()] = handler;
        }
        else {
            console.error('ATMF extension handler must inherit the Extension interface!');
            return;
        }
    }

    static GetAll() {
        return ATMFExtensions.#extensions;
    }

    static GetByName(name) {

        if (typeof ATMFExtensions.#extensions[name] == 'object')
            return ATMFExtensions.#extensions[name];
        else return null;
    }

    
    static ProcessTag(sender, tagName, args) {

        var extname = tagName.substr(1);
        var handler = ATMFExtensions.GetByName(extname);
        if (handler == null) return '';

        return handler.Get(args);
    }

    static SetTag(sender, tagName, args, value) {
        var extname = tagName.substr(1);
        var handler = ATMFExtensions.GetByName(extname);
        if (handler == null) return false;

        return handler.Set(args, value);
    }

}

export { ATMFExtensions as default };