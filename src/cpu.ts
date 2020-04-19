import { assert } from "./util"

export const RAM_SIZE = 2 ** 15

export class CPU {
    private _pc = 0

    a = 0
    d = 0
    // Technically doesn't belong here, but this is convenient.
    ram = Array.from<number>({ length: RAM_SIZE }).fill(0)

    get m() {
        assert(this.a <= 0x7fff, 'Accessed memory OOB, a=' + this.a)
        return this.ram[this.a]
    }

    set m(value) {
        assert(this.a <= 0x7fff, 'Accessed memory OOB, a=' + this.a)
        this.ram[this.a] = value
    }

    get pc() {
        return this._pc
    }

    set pc(value) {
        assert(value <= 0x7fff, 'PC out of bounds, tried to set ' + value)
        this._pc = value
    }
}
