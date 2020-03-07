
export function assert(arg: unknown, message = 'Failed assert'): asserts arg {
    if (!arg) {
        throw new Error(message)
    }
}
