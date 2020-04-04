export function ensureVisible(el: HTMLElement, pos: number) {
    if (Number.isNaN(pos) || pos < 0 || pos > el.scrollHeight + el.clientHeight) {
        return
    }
    if (el.scrollTop + el.clientHeight < pos) {
        el.scrollTop = pos - Math.floor(el.clientHeight * 2/3)
    } else if (pos < el.scrollTop) {
        el.scrollTop = pos - Math.floor(el.clientHeight * 1/3)
    }
}
