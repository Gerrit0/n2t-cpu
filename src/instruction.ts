import { assert } from "./util"
import { CPU } from "./cpu"

export type Instruction = {
    type: 'a' | 'c',
    eval: (cpu: CPU) => void,
    emit: () => string
}

function makeA(value: number): Instruction {
    return {
        type: 'a',
        eval: cpu => {
            cpu.a = value
            cpu.pc++
        },
        emit: () => `@${value}`
    }
}

const DEST_MAP = [
    '',
    'M=',
    'D=',
    'MD=',
    'A=',
    'AM=',
    'AD=',
    'AMD='
]

const JUMP_MAP = [
    '',
    ';JGT',
    ';JEQ',
    ';JGE',
    ';JLT',
    ';JNE',
    ';JLE',
    ';JMP'
]

// Only a few instructions are standard. Non standard instructions are mapped
// either to a custom mnemonic (chosen for simplicity) or to X instructions.
const X = Symbol()
const COMP_MAP = [
    'D&A',
    '!(D&A)',
    'D+A',
    X,
    'D&!A',
    '!(D&!A)',
    X,
    'A-D', // 0000111
    X,
    X,
    X,
    X,
    'D', // 0001100
    '!D',
    'D-1',
    '-D',
    '!D&A', // 0010000
    'D|!A',
    X,
    'D-A',
    '!D&!A',
    'D|A',
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    'D+1',
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    '0',
    X,
    X,
    X,
    X,
    X,
    'A',
    '!A',
    'A-1',
    '-A',
    X,
    X,
    X,
    'A+1',
    X,
    X,
    '-1',
    X,
    X,
    X,
    X,
    '1',
    'D&M', // 1000000, half done.
    '!(D&M)',
    'D+M',
    X,
    'D&!M',
    '!D|M',
    X,
    'M-D',
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    '!D&M',
    'D|!M',
    X,
    'D-M',
    '!D&!M',
    'D|M',
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    'M',
    '!M',
    'M-1',
    '-M',
    X,
    X,
    X,
    'M+1',
    X,
    X,
    X,
    X,
    X,
    X,
    X,
    X,
].map((v, i) => v === X ? `X${i.toString(16).toUpperCase()}` : v as string)

function makeC(comp: number, dest: number, jump: number): Instruction {
    return {
        type: 'c',
        eval: cpu => {
            let x = cpu.d
            let y = comp & 0b1000000 ? cpu.m : cpu.a
            if (comp & 0b0100000) {
                x = 0
            }
            if (comp & 0b0010000) {
                x = (~x) & 0xFFFF
            }
            if (comp & 0b0001000) {
                y = 0
            }
            if (comp & 0b0000100) {
                y = (~y) & 0xFFFF
            }
            let out = comp & 0b0000010 ? (x + y) & 0xFFFF : x & y
            if (comp & 0b0000001) {
                out = (~out) & 0xFFFF
            }

            // This must be done before setting new register values.
            const neg = out & 0x8000
            const zero = out === 0
            // LT EQ GT
            const cmp = (neg ? 0b100 : 0)
                | (zero ? 0b010 : 0)
                | (!neg && !zero ? 0b001 : 0)

            if (jump & cmp) {
                cpu.pc = cpu.a
            } else {
                cpu.pc++
            }

            // Order matters - m before a.
            if (dest & 0b001) {
                cpu.m = out
            }
            if (dest & 0b010) {
                cpu.d = out
            }
            if (dest & 0b100) {
                cpu.a = out
            }
        },
        emit: () => `${DEST_MAP[dest]}${COMP_MAP[comp]}${JUMP_MAP[jump]}`
    }
}

export function parse(instruction: string): Instruction {
    assert(/^[01]{16}$/.test(instruction), `Instruction '${instruction}' does not match format.`)

    if (instruction[0] === '0') {
        return makeA(parseInt(instruction, 2))
    }

    const comp = parseInt(instruction.substr(3, 7), 2)
    const dest = parseInt(instruction.substr(10, 3), 2)
    const jump = parseInt(instruction.substr(13, 3), 2)
    return makeC(comp, dest, jump)
}
