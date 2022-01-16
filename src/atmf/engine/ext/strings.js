class StrUppercase {

    constructor() {}

    Get(args) {

        var str = '';
        for (arg of args) str += arg;
        return str.toUpperCase();
    }

    Set(args, value) {
        return false;
    }

    static Register(ATMFEngine) {
        ATMFEngine.extensions.Register('upper', new StrUppercase());
    }
}

class StrLowercase {

    constructor() { }

    Get(args) {

        var str = '';
        for (arg of args) str += arg;
        return str.toLowerCase();
    }

    Set(args, value) {
        return false;
    }

    static Register(ATMFEngine) {
        ATMFEngine.extensions.Register('lower', new StrLowercase());
    }
}


class StrUcfirst {

    constructor() { }

    Get(args) {
        var str = '';
        for (const arg of args) str += arg;

        if (str != '') {
            const firstChar = str.substr(0, 1);
            const then = str.substr(1);
            return firstChar.toUpperCase() + then;
        }
        else return '';
    }

    Set(args, value) {
        return false;
    }

    static Register(ATMFEngine) {
        ATMFEngine.extensions.Register('ucfirst', new StrUcfirst());
    }
}

class StrLcfirst {

    constructor() { }

    Get(args) {

        var str = '';
        for (arg of args) str += arg;

        if (str != '') {
            const firstChar = str.toLowerCase(0, 1);
            const then = str.substr(1);
            return firstChar.toUpperCase() + then;
        }
        else return '';
    }

    Set(args, value) {
        return false;
    }

    static Register(ATMFEngine) {
        ATMFEngine.extensions.Register('lcfirst', new StrLcfirst());
    }
}

class Strings {
    static Register(ATMFEngine) {
        StrUppercase.Register(ATMFEngine);
        StrLowercase.Register(ATMFEngine);
        StrUcfirst.Register(ATMFEngine);
        StrLcfirst.Register(ATMFEngine);
    }
}

export {
    StrUppercase,
    StrLowercase,
    StrUcfirst,
    StrLcfirst,
    Strings as default
};