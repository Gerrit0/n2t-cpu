import tape from 'tape'
import { parse } from './instruction'
import { CPU } from './cpu'

tape('D=M', t => {
    t.plan(1)

    const cpu = new CPU()
    cpu.ram[0] = 12
    parse('1111110000010000').eval(cpu)

    t.equal(cpu.d, 12)
})

function testEval(name: string, instr: string, cb: (t: tape.Test, cpu: CPU) => void) {
    tape(name, t => {
        const cpu = new CPU()
        try {
            const worker = parse(instr)
            worker.eval(cpu)
            cb(t, cpu)
        } catch (err) {
            t.fail(err.message)
        }
    })
}

testEval('@15', '0000000000001111', (t, cpu) => {
    t.plan(1)
    t.equal(cpu.a, 0b1111)
})

testEval('AMD=1', '1110111111111000', (t, cpu) => {
    t.plan(3)
    t.equal(cpu.a, 1)
    t.equal(cpu.d, 1)
    t.equal(cpu.ram[0], 1)
})

testEval('A=0;JMP', '1110101010100111', (t, cpu) => {
    t.plan(1)
    t.equal(cpu.pc, 0)
})

testEval('D=-1', '1110111010010000', (t, cpu) => {
    t.plan(1)
    t.equal(cpu.d, 0xffff)
})


function testEmit(binary: string, instruction: string) {
    tape(`Emits ${binary} as ${instruction}`, t => {
        t.plan(1)
        t.equal(parse(binary).emit(), instruction)
    })
}

testEmit('1110111010010000', 'D=-1')
testEmit('1110101010100111', 'A=0;JMP')
testEmit('1111000010001000', 'M=D+M')
testEmit('1110111111001000', 'M=1')
testEmit('0000001111111111', '@1023')
testEmit('1111111111111111', 'AMD=X7F;JMP')
