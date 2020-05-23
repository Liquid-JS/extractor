export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // tslint:disable-next-line: no-bitwise
        const r = Math.random() * 16 | 0
        const v = c == 'x'
            ? r
            // tslint:disable-next-line: no-bitwise
            : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export type StylesProperty = Exclude<keyof CSSStyleDeclaration & string, 'length' | 'parentRule' | 'getPropertyPriority' | 'getPropertyValue' | 'item' | 'removeProperty' | 'setProperty'>

export type StylesObject = {
    [P in StylesProperty]: string
}

/**
 * Convert {@link CSSStyleDeclaration} to a {@link StylesObject}
 *
 * @param styles
 */
export function stylesToObj(styles?: CSSStyleDeclaration) {
    if (!styles)
        return

    return Object.fromEntries(Object.entries(styles)
        .filter(([key]) => key != 'cssText' && Number.isNaN(Number(key)) && typeof styles[key as any] === 'string')
    ) as StylesObject
}

/**
 * Apply styles to given target unless a property is present in defaultStyles
 *
 * @param target
 * @param styles
 * @param defaultStyles
 */
export function applyStyles(target: HTMLElement, styles?: StylesObject, defaultStyles?: StylesObject) {
    target.style.cssText = ''
    if (styles)
        (Object.keys(styles) as Array<keyof StylesObject>)
            .sort((a, b) => a.length - b.length)
            .forEach(k => {
                if (styles[k] !== defaultStyles?.[k]
                    && target.style[k] !== styles[k]
                )
                    target.style[k] = styles[k]
            })
}
