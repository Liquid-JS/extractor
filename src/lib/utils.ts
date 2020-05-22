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

export function stylesToObj(styles: CSSStyleDeclaration | undefined) {
    if (!styles)
        return

    return Object.fromEntries(Object.entries(styles)
        .filter(([key]) => key != 'cssText' && Number.isNaN(Number(key)) && typeof styles[key as any] === 'string')
    ) as StylesObject
}
