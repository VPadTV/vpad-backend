import { numify } from './numify';

type baseTypes = number | string | boolean
export type ParsedHTTPBody = baseTypes | ParsedHTTPBody[] | { [key: string | number]: ParsedHTTPBody }

export const parseBody = (obj: unknown) => {
    let newObj: ParsedHTTPBody;
    if (!obj) return undefined;
    if (typeof obj === 'string') {
        obj = obj.trim();
        switch (obj) {
            case 'undefined':
            case '':
                newObj = undefined;
                break;
            case 'true':
                newObj = true;
                break;
            case 'false':
                newObj = false;
                break;
            case 'null':
                newObj = null;
                break;
            default:
                const asNum = numify(obj);
                if (asNum) {
                    newObj = asNum;
                    break;
                }
                newObj = obj as ParsedHTTPBody;
        }
    } else if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            newObj = [];
            for (let el of obj) {
                newObj.push(parseBody(el));
            }
        } else {
            const bodyObj = obj as { [key: string]: unknown };
            newObj = {};
            for (const k in bodyObj) {
                newObj[k] = parseBody(bodyObj[k]);
            }
        }
    } else {
        newObj = obj as ParsedHTTPBody;
    }
    return newObj;
};
