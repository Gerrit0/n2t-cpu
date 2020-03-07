// Partial declaration, only contains what is used here.
declare class Clusterize {
    constructor(options: {
        rows: string[],
        scrollElem: HTMLElement,
        contentElem: HTMLElement
    })

    update(list: string[]): void
}

interface Window {
    machine?: import('./machine').Machine
    fileText?: string
}
