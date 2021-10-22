import { getDefaultStyles } from './container'
import { applyStyles, stylesToObj, uuidv4 } from './utils'

export interface SerializeOptions {
    /**
     * Tag names which will be ignored by style extractor
     *
     * @defaultValue Set {'BASE', 'HEAD', 'HTML', 'META', 'NOFRAME', 'NOSCRIPT', 'PARAM', 'SCRIPT', 'STYLE', 'TITLE'}
     */
    ignoredElements?: Set<string>

    /**
     * Tag names which will be ignored by style extractor
     *
     * @defaultValue Set {'::before', '::after', '::placeholder', '::marker'}
     */
    pseudoElements?: Set<string>
}

/**
 * Serialize element to string while inlining styles, and extracting styles for given pseudo elements
 *
 * @param element Target element to be serialized
 * @param options Serialization options
 */
export function serializeWithStyles(element: HTMLElement, options: SerializeOptions = {}) {
    const {
        ignoredElements = new Set(['BASE', 'HEAD', 'HTML', 'META', 'NOFRAME', 'NOSCRIPT', 'PARAM', 'SCRIPT', 'STYLE', 'TITLE']),
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
        const target = tplElements[i] as HTMLElement | undefined
        const tagname = el.tagName.toUpperCase()

        if (ignoredElements.has(tagname))
            return

        const elementStyles = stylesToObj(window.getComputedStyle(el))
        const defaultStyles = getDefaultStyles(tagname)

        if (target)
            applyStyles(target, elementStyles, defaultStyles)

        const pseudoClass = `c-${uuidv4()}`
        pseudoElements.forEach((pseudo) => {
            const ph = document.createElement('div')
            const pseudoStyles = stylesToObj(window.getComputedStyle(el, pseudo))
            const defaultPseudoStyles = getDefaultStyles(tagname, pseudo)

            applyStyles(ph, pseudoStyles, defaultPseudoStyles)

            if (ph.style.cssText) {
                target?.classList.add(pseudoClass)
                styles.push(`.${pseudoClass}${pseudo}{${ph.style.cssText}}`)
            }
        })
    })

    return styles.length
        ? `<style>${styles.join('')}</style>${tpl.innerHTML}`
        : tpl.innerHTML
}
