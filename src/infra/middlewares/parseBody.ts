export const parseBody = (body: unknown) => {
    let nbody: any;
    if(typeof body === "string") {
        switch(body) {
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
                if(!isNaN(parseFloat(body))) {
                    nbody = parseFloat(body)
                }
                break;
        }
    } else if(typeof body === "object") {
        if(Array.isArray(body)) {
            nbody = [];
            for(let el of body) {
                nbody.push(parseBody(el));
            }
        } else {
            nbody = {};
            for(const k in body) {
                nbody[k] = parseBody(body[k])
            }
        }
    } else {
        nbody = body;
    }
    return nbody;
}