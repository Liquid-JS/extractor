import { getDefaultStyles } from './container'
import { StylesObject, stylesToObj, uuidv4 } from './utils'

export function serializeWithStyles(element: HTMLElement, options: {
    noStyleTags?: Set<string>
    pseudoElements?: Set<string>
} = {}) {
    const {
        noStyleTags = new Set(['BASE', 'HEAD', 'HTML', 'META', 'NOFRAME', 'NOSCRIPT', 'PARAM', 'SCRIPT', 'STYLE', 'TITLE']),
        pseudoElements = new Set(['::before', '::after', '::placeholder', '::marker'])
    } = options

    if (element.nodeType !== Node.ELEMENT_NODE)
        throw new TypeError(`Expected ${Node.ELEMENT_NODE}, received ${element.nodeType}`)

    const tpl = document.createElement('template')
    tpl.innerHTML = element.outerHTML

    const elements = [element, ...Array.from(element.querySelectorAll<HTMLElement>('*'))]
    const tplElements = Array.from(tpl.content.querySelectorAll<HTMLElement>('*'))

    const styles = new Array<string>()

    elements.forEach((el, i) => {
        const target = tplElements[i]
        const tagname = el.tagName.toUpperCase()

        if (noStyleTags.has(tagname))
            return

        const elementStyles = stylesToObj(window.getComputedStyle(el))
        const defaultStyles = getDefaultStyles(tagname);

        (Object.keys(elementStyles || {}) as Array<keyof StylesObject>)
            .filter(k => elementStyles?.[k] && elementStyles?.[k] !== defaultStyles?.[k])
            .forEach(k => target.style[k] = elementStyles![k])

        const pseudoClass = `c-${uuidv4()}`
        pseudoElements.forEach((pseudo) => {
            const ph = document.createElement('div').style
            ph.cssText = ''
            const pseudoStyles = stylesToObj(window.getComputedStyle(el, pseudo))
            const defaultPseudoStyles = getDefaultStyles(tagname, pseudo);

            (Object.keys(pseudoStyles || {}) as Array<keyof StylesObject>)
                .filter(k => pseudoStyles?.[k] && pseudoStyles?.[k] !== defaultPseudoStyles?.[k])
                .forEach(k => ph[k] = pseudoStyles![k])

            if (ph.cssText) {
                target.classList.add(pseudoClass)
                styles.push(`.${pseudoClass}${pseudo}{${ph.cssText}}`)
            }
        })
    })

    return styles.length
        ? `<style>${styles}</style>${tpl.innerHTML}`
        : tpl.innerHTML
}
