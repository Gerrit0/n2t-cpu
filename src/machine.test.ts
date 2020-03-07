import tape from 'tape'
import { Machine } from './machine'
import { parse } from './instruction'

// Add.asm from project 6
const addInstructions = `0000000000000010
1110110000010000
0000000000000011
1110000010010000
0000000000000000
1110001100001000`.split('\n').map(parse)

const maxInstructions = `0000000000001111
0000000000000000
1111110000010000
0000000000000001
1111010011010000
0000000000001100
1110001100000001
0000000000001111
0000000000000001
1111110000010000
0000000000001110
1110101010000111
0000000000000000
1111110000010000
0000000000000010
1110001100001000
0000000000010000
1110101010000111`.split('\n').map(parse)

tape('Add.asm works', t => {
    t.plan(1)

    const machine = new Machine(addInstructions)
    for (let i = 0; i < addInstructions.length; i++) {
        machine.step()
    }
    t.equal(machine.ram[0], 5)
})

tape('Max.asm works', t => {
    t.plan(1)

    const machine = new Machine(maxInstructions)
    machine.ram[0] = 17
    machine.ram[1] = 15
    for (let i = 0; i < 20; i++) {
        machine.step()
    }
    t.equal(machine.ram[2], 17)
})
