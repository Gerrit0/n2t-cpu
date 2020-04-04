import { parse, Instruction } from "./instruction"
import { Machine } from "./machine"
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

fileUpload.addEventListener('change', () => {
    if (fileUpload.files && fileUpload.files[0]) {
        loadFile(fileUpload.files[0])
    }
}, { passive: true })
Mousetrap.bind('mod+o', event => {
    event.preventDefault()
    fileUpload.click()
})

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
        if (i === m.cpu.pc) {
            return `<div class="row hl"><strong>${i}</strong><span>${inst.emit()}</span></div>`
        }
        return `<div class="row"><strong>${i}</strong><span>${inst.emit()}</span></div>`
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

function updateReg() {
    const machine = window.machine
    if (!machine) return

    dValue.textContent = toDecimal(machine.cpu.d)
    aValue.textContent = toDecimal(machine.cpu.a)
    mValue.textContent = machine.cpu.a <= 0x7fff ? toDecimal(machine.cpu.m) : 'Out of bounds'
    pcValue.textContent = toDecimal(machine.cpu.pc)
}

function step(n: number) {
    const m = window.machine
    if (!m) return;

    try {
        for (let i = 0; i < n; i++) {
            m.step()
            if (m.cpu.a >= SCREEN && m.cpu.a < 0x7fff && context) {
                const y = Math.floor((m.cpu.a - SCREEN) / 32)
                const xStart = ((m.cpu.a) - SCREEN - y * 32)
                const mem = m.cpu.m;
                for (let i = 0; i < 16; i++) {
                    context.fillStyle = mem & (1 << i) ? 'black' : 'white'
                    context.fillRect(xStart + i, y, 1, 1)
                }
            }
        }
    } catch (err) {
        alert(err.message)
    } finally {
        refreshGui(m)
    }
}
