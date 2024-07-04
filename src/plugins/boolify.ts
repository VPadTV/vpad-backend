export const boolify = (val: unknown): boolean => {
    if (typeof val === 'boolean') return val;
    else if (typeof val === 'string') {
        if (val === 'true') return true
        else return false
    }
    return !!val
}