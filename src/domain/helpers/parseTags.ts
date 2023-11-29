import { tagRegex } from "./regex"

export const parseTags = (tags: unknown): string[] | false => {
    if (!tags || typeof tags !== 'string') return false
    const tagList = tags.split(',')
        .map(tag => tag.toLowerCase().trim())
    for (const tag of tagList)
        if (!tagRegex().test(tag)) return false
    return tagList
}