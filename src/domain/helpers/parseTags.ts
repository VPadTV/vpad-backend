import { tagRegex } from "./regex"

export const parseTags = (tags: string): string[] | false => {
    const tagList = tags.split(',')
        .map(tag => tag.toLowerCase().trim())
    for (const tag of tagList)
        if (!tagRegex().test(tag)) return false
    return tagList
}