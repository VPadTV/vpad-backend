export const numify = (val: unknown): number | false => {
    if (typeof val === 'number') return val;
    else if (typeof val === 'string') {
        let parsed = parseFloat(val)
        if (!isNaN(parsed)) return parsed
    }
    return false
}