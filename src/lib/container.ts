import { stylesToObj } from './utils'

/**
 * An isolated container, used to determine browser's default styles
 */
const frame = document.createElement('iframe')
frame.setAttribute('style', Object.entries({
    width: '0 !important',
    height: '0 !important',
    overflow: 'hidden !important',
    display: 'none !important',
    border: 'none !important'
})
    .map(e => e.join(':'))
    .join(';')
)
document.body.appendChild(frame)

const win = frame.contentWindow
const doc = frame.contentDocument || win?.document
const defaultStylesMap = new Map<string, ReturnType<typeof stylesToObj>>()

/**
 * Compute default styles for given tagname / pseudo element
 *
 * @param tagname
 * @param pseudo Optional pseudo element name
 */
export function computeDefaultStyles(tagname: string, pseudo?: string) {
    const element = doc?.createElement(tagname)
    if (!element)
        return undefined

    doc?.body.appendChild(element)

    const styles = stylesToObj(pseudo
        ? win?.getComputedStyle(element, pseudo)
        : win?.getComputedStyle(element)
    )

    doc?.body.removeChild(element)

    return styles
}

/**
 * Get (cached) default styles for given tagname / pseudo element
 *
 * @param tagname
 * @param pseudo Optional pseudo element name
 */
export function getDefaultStyles(tagname: string, pseudo?: string) {
    const key = (pseudo
        ? `${tagname}${pseudo}`
        : tagname
    ).toUpperCase()

    if (!defaultStylesMap.has(key))
        defaultStylesMap.set(key, computeDefaultStyles(tagname, pseudo))

    return defaultStylesMap.get(key)
}
