export const boolify = (val: unknown): boolean => {
    if (typeof val === 'boolean') return val;
    else if (typeof val === 'string' && val.toLowerCase() === 'true') return true
    return false
}