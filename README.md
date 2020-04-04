# n2t-cpu

An implementation of the [nand2tetris](https://www.nand2tetris.org/) CPU emulator that runs in your browser.

Supports drawing to the screen, but not keyboard input.

[Try it out!](https://gerritbirkeland.com/n2t-cpu/emulator/index.html)

## Features

- Support for all instructions, not just the author's 18 default mnemonics.
- Keyboard shortcuts (replace CTRL with Command on Mac)
    | Shortcut | Behavior |
    | --- | --- |
    | `s` | Step 1 |
    | `x` | Step X |
    | `shift+x` | Step X (prompt for X) |
    | `ctrl+g` | Go to ROM address |
    | `ctrl+h` | Go to RAM address |
