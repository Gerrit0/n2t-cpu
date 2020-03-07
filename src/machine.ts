import { CPU } from "./cpu";
import { Instruction, parse } from "./instruction";

export class Machine {
    private _ticks = 0
    readonly cpu = new CPU()
    readonly rom: readonly Instruction[]
    readonly histogram = Array.from<number>({ length: 2 ** 15}).fill(0)

    get ram() {
        return this.cpu.ram
    }

    get ticks() {
        return this._ticks
    }

    constructor(instructions: readonly Instruction[]) {
        const rom = instructions.slice()
        while (rom.length < 2 ** 15) {
            rom.push(parse('0000000000000000'))
        }
        this.rom = rom
    }

    step() {
        this._ticks++
        this.histogram[this.cpu.pc]++
        this.rom[this.cpu.pc].eval(this.cpu)
    }

    toString() {
        return `Machine { a = ${this.cpu.a}, d = ${this.cpu.d}, m = ${this.cpu.m}, pc = ${this.cpu.pc}}`
    }
}
