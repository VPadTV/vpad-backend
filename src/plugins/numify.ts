export const numify = (val: unknown): number | undefined => {
    if (typeof val === 'number') return val;
    else if (typeof val === 'string') {
        let parsed = parseFloat(val)
        if (!isNaN(+val)) return parsed
    }
    return undefined
}