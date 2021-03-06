import { parse, Instruction } from "./instruction"
import { Machine, RAM_SIZE } from "./machine"
import { ensureVisible } from "./gui"

console.log('Inspect the window.machine global after loading a hack file.')

const $ = (sel: string) => document.querySelector(sel) as HTMLElement

const SCREEN = 16384
const PAUSE = '❙❙'
const PLAY = '▶'

// Needed because 0xffff = -1, not 65k. We are dealing with signed 16 bit ints here
function toDecimal(num: number) {
    let sign = ''
    if (num & 0x8000) {
        // negative
        num = ((~num) & 0x7FFF) + 1
        sign = '-'
    }
    return sign + num.toString()
}

const fileUpload = $('#load-hack') as HTMLInputElement
const ramUpload = $('#load-ram') as HTMLInputElement
const actionStep = $('#action-step') as HTMLButtonElement
const actionStepX = $('#action-step-x') as HTMLButtonElement
const inputStepX = $('#input-step-x') as HTMLInputElement
const dValue = $('#d-value')
const aValue = $('#a-value')
const mValue = $('#m-value')
const pcValue = $('#pc-value')
const inputStepRate = $('#input-step-rate') as HTMLInputElement
const playingLabel = $('#playing-label')
playingLabel.textContent = PLAY

const canvas = $('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')

const breakpoints = new Set<number>()

$('#action-reset').addEventListener('click', () => {
    cancelRun()
    load(window.fileText)
}, { passive: true })

let runTimer: undefined | number
$('#action-step-rate').addEventListener('click', () => {
    if (runTimer) {
        cancelRun()
    } else {
        startRun()
    }
}, { passive: true })

function cancelRun() {
    clearTimeout(runTimer as number)
    runTimer = undefined

    inputStepRate.disabled = actionStep.disabled = actionStepX.disabled = inputStepX.disabled = false
    playingLabel.textContent = PLAY

}

function startRun() {
    inputStepRate.disabled = actionStep.disabled = actionStepX.disabled = inputStepX.disabled = true
    playingLabel.textContent = PAUSE

    const interval = +inputStepRate.value / 1000
    runTimer = setTimeout(function run() {
        step(1)
        runTimer = setTimeout(run, interval) as unknown as number
    }, interval) as unknown as number
}

actionStep.addEventListener('click', () => step(1), { passive: true })
Mousetrap.bind('s', event => {
    event.preventDefault()
    if (!runTimer) {
        step(1)
    }
})
actionStepX.addEventListener('click', () => step(+inputStepX.value), { passive: true })
Mousetrap.bind('x', event => {
    event.preventDefault()
    if (!runTimer) {
        step(+inputStepX.value)
    }
})
Mousetrap.bind('shift+x', event => {
    event.preventDefault()
    if (!runTimer && window.machine) {
        const steps = +(prompt("How many steps?", inputStepX.value) || '')
        if (!Number.isNaN(steps) && steps > 0) {
            step(steps)
        }
    }
})

const clusterRom = new Clusterize({
    rows: [],
    scrollElem: $('#rom .clusterize-scroll'),
    contentElem: $('#rom .clusterize-content')
})
Mousetrap.bind('mod+g', event => {
    event.preventDefault()
    const address = +(prompt("Which ROM address?") || '')
    ensureVisible(clusterRom.scroll_elem, address * 24)
})
clusterRom.content_elem.addEventListener('input', event => {
    const checkbox = event.target as HTMLInputElement
    const row = checkbox.parentElement
    if (!row) return
    const pc = row.dataset.pc
    if (!pc) return
    if (checkbox.checked) {
        breakpoints.add(+pc)
        row.classList.add('bp')
    } else {
        breakpoints.delete(+pc)
        row.classList.remove('bp')
    }
})
Mousetrap.bind('mod+b', event => {
    event.preventDefault()
    if (window.machine) {
        breakpoints.add(window.machine.cpu.pc);
        const row = clusterRom.content_elem.querySelector(`[data-pc="${window.machine.cpu.pc}"]`)
        if (row instanceof HTMLElement) {
            row.classList.add('bp')
            row.querySelector('input')!.checked = true
        }
    }
})
Mousetrap.bind('mod+shift+b', event => {
    event.preventDefault()
    if (window.machine) {
        const where = +(prompt('Where in ROM should be breakpoint be set?', window.machine.cpu.pc.toString()) || '');
        if (!Number.isNaN(where)) {
            breakpoints.add(where);
            const row = clusterRom.content_elem.querySelector(`[data-pc="${where}"]`)
            if (row instanceof HTMLElement) {
                row.classList.add('bp')
                row.querySelector('input')!.checked = true
            }
        }
    }
})

const clusterRam = new Clusterize({
    rows: [],
    scrollElem: $('#ram .clusterize-scroll'),
    contentElem: $('#ram .clusterize-content')
})
Mousetrap.bind('mod+h', event => {
    event.preventDefault()
    const address = +(prompt("Which RAM address?") || '')
    ensureVisible(clusterRam.scroll_elem, address * 24)
})
const clusterStack = new Clusterize({
    rows: [],
    scrollElem: $('#stack .clusterize-scroll'),
    contentElem: $('#stack .clusterize-content'),
})

fileUpload.addEventListener('input', () => {
    if (fileUpload.files && fileUpload.files[0]) {
        loadFile(fileUpload.files[0])
    }
}, { passive: true })
Mousetrap.bind('mod+o', event => {
    event.preventDefault()
    fileUpload.click()
})

ramUpload.addEventListener('input', () => {
    if (ramUpload.files && ramUpload.files[0]) {
        loadRam(ramUpload.files[0])
    }
}, { passive: true })
Mousetrap.bind('mod+shift+o', event => {
    event.preventDefault()
    ramUpload.click()
})

function loadRam(file: File) {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
        if (!window.machine) {
            alert("Can't load RAM without a machine. Load hack file first.")
            return;
        }

        const text = reader.result as string
        for (const line of text.split(/\r?\n/)) {
            const match = line.match(/^RAM\[(\d{1,5})\]: (\d+)$/)
            if (match) {
                const address = parseInt(match[1], 10)
                let value = parseInt(match[2], 10)
                if (value < 0) {
                    value = -value & 0xFFFF
                    value |= 0x8000
                }
                window.machine.ram[address] = value & 0xFFFF
            }
        }
        refreshGui(window.machine)
        refreshScreen()
    }, { passive: true })

    reader.readAsText(file)
}

function loadFile(file: File) {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
        window.fileText = reader.result as string
        load(window.fileText)
    }, { passive: true })
    reader.readAsText(file)
}

function load(text: string | undefined) {
    try {
        const instructions = text?.split('\n').map(l => l.trim()).filter(Boolean).map(parse) ?? []
        setupEmulator(instructions)
    } catch (error) {
        alert(error.message)
    }
}

function setupEmulator(instructions: Instruction[]) {
    cancelRun()
    window.machine = new Machine(instructions)
    step(0)
    if (context) {
        context.fillStyle = 'white'
        context.fillRect(0, 0, canvas.width, canvas.height)
    }
}

function refreshGui(m: Machine) {
    updateReg()
    clusterRom.update(m.rom.map((inst, i) => {
        let html = `<div data-pc="${i}" class="row`
        if (i === m.cpu.pc) {
            html += ' hl'
        }
        if (breakpoints.has(i)) {
            html += ' bp'
        }
        html += '"><input type="checkbox"'
        if (breakpoints.has(i)) {
            html += ' checked'
        }
        return `${html}><strong>${i}</strong><span>${inst.emit()}</span></div>`
    }))
    ensureVisible(clusterRom.scroll_elem, 24 * m.cpu.pc);

    const ramNameMap: Record<number, string | undefined>  = {
        0: 'SP',
        1: 'LCL',
        2: 'ARG',
        3: 'THIS',
        4: 'THAT',
        5: 'Temp 0',
        6: 'Temp 1',
        7: 'Temp 2',
        8: 'Temp 3',
        9: 'Temp 4',
        10: 'Temp 5',
        11: 'Temp 6',
        12: 'Temp 7',
        13: 'R13',
        14: 'R14',
        15: 'R15',
        16384: 'SCREEN',
        24576: 'KBD'
    }

    const getName = (i: number) => ramNameMap[i] ? `${i} | ${ramNameMap[i]}` : `${i}`

    clusterRam.update(m.ram.map((ram, i) => {
        if (i === m.cpu.a) {
            return `<div class="row hl"><strong>${getName(i)}</strong><span>${toDecimal(ram)}</span></div>`
        }
        return `<div class="row"><strong>${getName(i)}</strong><span>${toDecimal(ram)}</span></div>`
    }))
    ensureVisible(clusterRam.scroll_elem, 24 * m.cpu.a)

    clusterStack.update(m.ram.slice(256, m.ram[0] + 5).map((ram, i) => {
        if (i + 256 === m.ram[0]) {
            return `<div class="row hl"><strong>${i + 256}</strong><span>${toDecimal(ram)}</span></div>`
        }
        return `<div class="row"><strong>${i + 256}</strong><span>${toDecimal(ram)}</span></div>`
    }))
    ensureVisible(clusterStack.scroll_elem, 24 * (m.ram[0] - 256))
}

function refreshScreen(m = window.machine) {
    if (!context || !m) return

    for (let i = SCREEN; i < RAM_SIZE - 1; i++) {
        const y = Math.floor((i - SCREEN) / 32)
        const xStart = (i - SCREEN - y * 32) * 16
        const mem = m.ram[i]
        for (let j = 0; j < 16; j++) {
            context.fillStyle = mem & (1 << j) ? 'black' : 'white'
            context.fillRect(xStart + j, y, 1, 1)
        }
    }
}

function updateReg() {
    const machine = window.machine
    if (!machine) return

    dValue.textContent = toDecimal(machine.cpu.d)
    aValue.textContent = toDecimal(machine.cpu.a)
    mValue.textContent = machine.cpu.a < RAM_SIZE ? toDecimal(machine.cpu.m) : 'Out of bounds'
    pcValue.textContent = toDecimal(machine.cpu.pc)
}

function step(n: number) {
    const m = window.machine
    if (!m) return;

    try {
        for (let i = 0; i < n; i++) {
            m.step()
            if (breakpoints.has(m.cpu.pc)) {
                break
            }
        }
    } catch (err) {
        alert(err.message)
    } finally {
        refreshGui(m)
        refreshScreen(m)
    }
}
