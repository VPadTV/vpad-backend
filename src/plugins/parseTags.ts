import { tagRegex } from './regex'

export const parseTags = (tags: unknown): string[] | undefined => {
    if (!tags || typeof tags !== 'string') return undefined
    const tagList = tags.split(',')
        .map(tag => tag.toLowerCase().trim())
    for (const tag of tagList)
        if (!tagRegex().test(tag)) return undefined
    return tagList
}