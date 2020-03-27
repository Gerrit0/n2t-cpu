import { parse, Instruction } from "./instruction"
import { Machine } from "./machine"

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
actionStepX.addEventListener('click', () => step(+inputStepX.value), { passive: true })

const clusterRom = new Clusterize({
    rows: [],
    scrollElem: $('#rom .clusterize-scroll'),
    contentElem: $('#rom .clusterize-content')
})
const clusterRam = new Clusterize({
    rows: [],
    scrollElem: $('#ram .clusterize-scroll'),
    contentElem: $('#ram .clusterize-content')
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

function updateReg() {
    const machine = window.machine
    if (!machine) return

    dValue.textContent = toDecimal(machine.cpu.d)
    aValue.textContent = toDecimal(machine.cpu.a)
    mValue.textContent = toDecimal(machine.cpu.m)
    pcValue.textContent = toDecimal(machine.cpu.pc)
}

function step(n: number) {
    const m = window.machine
    if (!m) return;

    try {
        for (let i = 0; i < n; i++) {
            m.step()
            if (m.cpu.a >= SCREEN && context) {
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
    }

    function ensureVisible(el: HTMLElement, pos: number) {
        if (el.scrollTop + el.clientHeight < pos) {
            el.scrollTop = pos - Math.floor(el.clientHeight * 2/3)
        } else if (pos < el.scrollTop) {
            el.scrollTop = pos - Math.floor(el.clientHeight * 1/3)
        }
    }

    updateReg()
    clusterRom.update(m.rom.map((inst, i) => {
        if (i === m.cpu.pc) {
            return `<div class="row hl"><strong>${i}</strong><span>${inst.emit()}</span></div>`
        }
        return `<div class="row"><strong>${i}</strong><span>${inst.emit()}</span></div>`
    }))
    ensureVisible($('#rom .clusterize-scroll'), 24 * m.cpu.pc);

    clusterRam.update(m.ram.map((ram, i) => {
        if (i === m.cpu.a) {
            return `<div class="row hl"><strong>${i}</strong><span>${toDecimal(ram)}</span></div>`
        }
        return `<div class="row"><strong>${i}</strong><span>${toDecimal(ram)}</span></div>`
    }))
    ensureVisible($('#ram .clusterize-scroll'), 24 * m.cpu.a)

    clusterStack.update(m.ram.slice(256, m.ram[0] + 5).map((ram, i) => {
        if (i + 256 === m.ram[0]) {
            return `<div class="row hl"><strong>${i}</strong><span>${toDecimal(ram)}</span></div>`
        }
        return `<div class="row"><strong>${i}</strong><span>${toDecimal(ram)}</span></div>`
    }))
    ensureVisible($('#stack .clusterize-scroll'), 24 * (m.ram[0] - 256))
}


