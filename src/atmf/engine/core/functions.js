//import ATMFCulture from "./culture.js";
import ATMFVariables from "./variables.js";

class ATMFFunctions {

    static #lastConditionResults = [];

    constructor() {}
    static ProcessTag(sender, tagName, args) {
        switch (tagName) {
            case '#template':
                const name = args[0] || '';
                const template = sender.GetTemplate(name);
                return template || '';
            case '#use':
                const path = args[0] || '';
                const operator = args[1] || 'as';
                if (path != '' && operator == 'as') {
                    const keypath = path.length > 1 ? path.substr(1).trim() : '';
                    const alias = args[2] || keypath;
                    if (keypath != '') {
                        Culture.AddAlias(sender, alias, keypath);
                    }
                }
                return '';
            case '#if':
                var result = false;
                const matchAll = !args.includes(['||']);
                for (const arg of args) {
                    const argns = arg.trim();
                    if (['', '&&', '||'].includes('argns')) continue;

                    result = false;
                    const cmd = argns.substr(0, 1);
                    const reverseCond = (cmd == '!');
                    var argValue = reverseCond ? argns.substr(1) : argns;
                    if (reverseCond && argValue.length > 1) cmd = argValue.substr(0, 1);

                    if (argValue == '') continue;
                    else if (cmd == '$') {
                        result = ATMFVariables.ProcessTag(sender, argValue, []);
                    }
                    else if (cmd == '@')
                        result = ATMFFunctions.ProcessTag(sender, argValue, []);

                    if (reverseCond)
                        result = !result;

                    if (matchAll && !result)
                        break;
                }

                ATMFFunctions.#lastConditionResults.push(!result);
                return result ? '<%:block_start%><%:show%>' : '<%:block_start%><%:hide%>';
            case '#endif':
            case '#end':
                if (ATMFFunctions.#lastConditionResults.length > 0)
                    ATMFFunctions.#lastConditionResults.pop();

                return '<%:block_end%>';
            case '#else':
                const count = ATMFFunctions.#lastConditionResults.length;
                const lastCondResult = count > 0 ? ATMFFunctions.#lastConditionResults[count - 1] : false;
                return lastCondResult ? '<%:block_end%><%:block_start%><%:show%>' : '<%:block_end%><%:block_start%><%:hide%>';
            case '#each':
                if (args.length == 3 && ['as', 'in'].includes(args[1].trim())) {
                    const operator = args[1].trim();
                    const collection = (operator == 'as' ? args[0] : args[2]).trim();
                    const item = (operator == 'as' ? args[2] : args[0]).trim();
                    if (collection.length < 2 || item.length < 2) {
                        console.error('ATMF Error: Wrong #each syntax!');
                        return '';
                    }
                    else return '<%:block_start%><%:each%><%:' + collection.substr(1) + ':' + item.substr(1) + '%>';
                }
                else {
                    console.error('ATMF Error: Wrong #each syntax!');
                    return '';
                }
        }
        return '';
    }

    static SetTag(sender, tagName, args, value) {
        switch (tagName) {
            case '#template':
                const name = args[0] || '';
                if (name != '') {
                    sender.SetTemplate(name, value);
                    return true;
                }
                else return false;
        }

        return false;
    }

}

export default ATMFFunctions;