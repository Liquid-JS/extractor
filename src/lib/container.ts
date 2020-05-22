import { stylesToObj } from './utils'

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

const defaultStylesMap = new Map<string, ReturnType<typeof stylesToObj>>()

export function computeDefaultStyles(tagname: string, pseudo?: string) {
    const element = frame.contentWindow?.document?.createElement(tagname)
    if (!element)
        return undefined

    frame.contentWindow?.document?.body.appendChild(element)

    const styles = stylesToObj(pseudo
        ? frame.contentWindow?.getComputedStyle(element, pseudo)
        : frame.contentWindow?.getComputedStyle(element)
    )

    frame.contentWindow?.document?.body.removeChild(element)

    return styles
}

export function getDefaultStyles(tagname: string, pseudo?: string) {
    const key = (pseudo
        ? `${tagname}${pseudo}`
        : tagname
    ).toUpperCase()

    if (!defaultStylesMap.has(key))
        defaultStylesMap.set(key, computeDefaultStyles(tagname, pseudo))

    return defaultStylesMap.get(key)
}
