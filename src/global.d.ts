// Partial declaration, only contains what is used here.
declare class Clusterize {
    constructor(options: {
        rows: string[],
        scrollElem: HTMLElement,
        contentElem: HTMLElement
    })

    update(list: string[]): void
    scroll_elem: HTMLElement
    content_elem: HTMLElement
}

interface Window {
    machine?: import('./machine').Machine
    fileText?: string
}

declare namespace Mousetrap {
    export function bind(event: string, callback: (event: Event) => void): void;
}
