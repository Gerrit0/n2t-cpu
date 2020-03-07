import { parse, Instruction } from "./instruction"
import { Machine } from "./machine"

const $ = (sel: string) => document.querySelector(sel) as HTMLElement

const SCREEN = 16384

// Needed because 0xffff = -1, not 65k. We are dealing with signed 16 bit ints here
function toDecimal(num: number) {
    if (num & 0x8000) {
        // negative
        num = ((~num) & 0x7FFF) + 1
    }
    return num.toString()
}

const fileUpload = $('#load-hack') as HTMLInputElement
const actionStep = $('#action-step')
const actionStepX = $('#action-step-x')
const inputStepX = $('#input-step-x') as HTMLInputElement
const dValue = $('#d-value')
const aValue = $('#a-value')
const mValue = $('#m-value')
const pcValue = $('#pc-value')
const canvas = $('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')

$('#action-reset').addEventListener('click', () => {
    load(window.fileText)
})

actionStep.addEventListener('click', () => step(1))
actionStepX.addEventListener('click', () => step(+inputStepX.value))

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

fileUpload.addEventListener('change', () => {
    if (fileUpload.files && fileUpload.files[0]) {
        loadFile(fileUpload.files[0])
    }
})

function loadFile(file: File) {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
        window.fileText = reader.result as string
        load(window.fileText)
    })
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

    updateReg()
    clusterRom.update(m.rom.map((inst, i) => {
        if (i === m.cpu.pc) {
            return `<div class="row hl"><strong>${i}</strong><span>${inst.emit()}</span></div>`
        }
        return `<div class="row"><strong>${i}</strong><span>${inst.emit()}</span></div>`
    }))
    $('#rom .clusterize-scroll').scrollTop = Math.max(0, 24 * (m.cpu.pc - 5));

    clusterRam.update(m.ram.map((ram, i) => {
        if (i === m.cpu.a) {
            return `<div class="row hl"><strong>${i}</strong><span>${toDecimal(ram)}</span></div>`
        }
        return `<div class="row"><strong>${i}</strong><span>${toDecimal(ram)}</span></div>`
    }))
    $('#ram .clusterize-scroll').scrollTop = Math.max(0, 24 * (m.cpu.a - 5));
}


