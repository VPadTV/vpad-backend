export const parseBody = (body: unknown) => {
    let nbody: any;
    if (!body) return undefined;
    if (typeof body === "string") {
        switch (body) {
            case "undefined":
                nbody = undefined;
                break;
            case "true":
                nbody = true;
                break;
            case "false":
                nbody = false;
                break;
            case "null":
                nbody = null;
                break;
            case "":
                nbody = undefined;
                break;
            default:
                if (!isNaN(parseFloat(body))) {
                    nbody = parseFloat(body)
                    break;
                }
                nbody = body
        }
    } else if (typeof body === "object") {
        if (Array.isArray(body)) {
            nbody = [];
            for (let el of body) {
                nbody.push(parseBody(el));
            }
        } else {
            const bodyObj = body as { [key: string]: unknown }
            nbody = {};
            for (const k in bodyObj) {
                nbody[k] = parseBody(bodyObj[k])
            }
        }
    } else {
        nbody = body;
    }
    return nbody;
}