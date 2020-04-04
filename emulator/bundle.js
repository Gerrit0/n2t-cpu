/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/cpu.ts":
/*!********************!*\
  !*** ./src/cpu.ts ***!
  \********************/
/*! exports provided: CPU */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CPU\", function() { return CPU; });\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./src/util.ts\");\n\r\nclass CPU {\r\n    constructor() {\r\n        this._pc = 0;\r\n        this.a = 0;\r\n        this.d = 0;\r\n        // Technically doesn't belong here, but this is convenient.\r\n        this.ram = Array.from({ length: 2 ** 15 }).fill(0);\r\n    }\r\n    get m() {\r\n        Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"assert\"])(this.a <= 0x7fff, 'Accessed memory OOB, a=' + this.a);\r\n        return this.ram[this.a];\r\n    }\r\n    set m(value) {\r\n        Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"assert\"])(this.a <= 0x7fff, 'Accessed memory OOB, a=' + this.a);\r\n        this.ram[this.a] = value;\r\n    }\r\n    get pc() {\r\n        return this._pc;\r\n    }\r\n    set pc(value) {\r\n        Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"assert\"])(value < 0x7fff, 'PC out of bounds, tried to set ' + value);\r\n        this._pc = value;\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/cpu.ts?");

/***/ }),

/***/ "./src/gui.ts":
/*!********************!*\
  !*** ./src/gui.ts ***!
  \********************/
/*! exports provided: ensureVisible */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ensureVisible\", function() { return ensureVisible; });\nfunction ensureVisible(el, pos) {\r\n    if (Number.isNaN(pos) || pos < 0 || pos > el.scrollHeight + el.clientHeight) {\r\n        return;\r\n    }\r\n    if (el.scrollTop + el.clientHeight < pos) {\r\n        el.scrollTop = pos - Math.floor(el.clientHeight * 2 / 3);\r\n    }\r\n    else if (pos < el.scrollTop) {\r\n        el.scrollTop = pos - Math.floor(el.clientHeight * 1 / 3);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/gui.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _instruction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instruction */ \"./src/instruction.ts\");\n/* harmony import */ var _machine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./machine */ \"./src/machine.ts\");\n/* harmony import */ var _gui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gui */ \"./src/gui.ts\");\n\r\n\r\n\r\nconsole.log('Inspect the window.machine global after loading a hack file.');\r\nconst $ = (sel) => document.querySelector(sel);\r\nconst SCREEN = 16384;\r\nconst PAUSE = '❙❙';\r\nconst PLAY = '▶';\r\n// Needed because 0xffff = -1, not 65k. We are dealing with signed 16 bit ints here\r\nfunction toDecimal(num) {\r\n    let sign = '';\r\n    if (num & 0x8000) {\r\n        // negative\r\n        num = ((~num) & 0x7FFF) + 1;\r\n        sign = '-';\r\n    }\r\n    return sign + num.toString();\r\n}\r\nconst fileUpload = $('#load-hack');\r\nconst actionStep = $('#action-step');\r\nconst actionStepX = $('#action-step-x');\r\nconst inputStepX = $('#input-step-x');\r\nconst dValue = $('#d-value');\r\nconst aValue = $('#a-value');\r\nconst mValue = $('#m-value');\r\nconst pcValue = $('#pc-value');\r\nconst inputStepRate = $('#input-step-rate');\r\nconst playingLabel = $('#playing-label');\r\nplayingLabel.textContent = PLAY;\r\nconst canvas = $('canvas');\r\nconst context = canvas.getContext('2d');\r\nconst breakpoints = new Set();\r\n$('#action-reset').addEventListener('click', () => {\r\n    cancelRun();\r\n    load(window.fileText);\r\n}, { passive: true });\r\nlet runTimer;\r\n$('#action-step-rate').addEventListener('click', () => {\r\n    if (runTimer) {\r\n        cancelRun();\r\n    }\r\n    else {\r\n        startRun();\r\n    }\r\n}, { passive: true });\r\nfunction cancelRun() {\r\n    clearTimeout(runTimer);\r\n    runTimer = undefined;\r\n    inputStepRate.disabled = actionStep.disabled = actionStepX.disabled = inputStepX.disabled = false;\r\n    playingLabel.textContent = PLAY;\r\n}\r\nfunction startRun() {\r\n    inputStepRate.disabled = actionStep.disabled = actionStepX.disabled = inputStepX.disabled = true;\r\n    playingLabel.textContent = PAUSE;\r\n    const interval = +inputStepRate.value / 1000;\r\n    runTimer = setTimeout(function run() {\r\n        step(1);\r\n        runTimer = setTimeout(run, interval);\r\n    }, interval);\r\n}\r\nactionStep.addEventListener('click', () => step(1), { passive: true });\r\nMousetrap.bind('s', event => {\r\n    event.preventDefault();\r\n    if (!runTimer) {\r\n        step(1);\r\n    }\r\n});\r\nactionStepX.addEventListener('click', () => step(+inputStepX.value), { passive: true });\r\nMousetrap.bind('x', event => {\r\n    event.preventDefault();\r\n    if (!runTimer) {\r\n        step(+inputStepX.value);\r\n    }\r\n});\r\nMousetrap.bind('shift+x', event => {\r\n    event.preventDefault();\r\n    if (!runTimer && window.machine) {\r\n        const steps = +(prompt(\"How many steps?\", inputStepX.value) || '');\r\n        if (!Number.isNaN(steps) && steps > 0) {\r\n            step(steps);\r\n        }\r\n    }\r\n});\r\nconst clusterRom = new Clusterize({\r\n    rows: [],\r\n    scrollElem: $('#rom .clusterize-scroll'),\r\n    contentElem: $('#rom .clusterize-content')\r\n});\r\nMousetrap.bind('mod+g', event => {\r\n    event.preventDefault();\r\n    const address = +(prompt(\"Which ROM address?\") || '');\r\n    Object(_gui__WEBPACK_IMPORTED_MODULE_2__[\"ensureVisible\"])(clusterRom.scroll_elem, address * 24);\r\n});\r\nclusterRom.content_elem.addEventListener('input', event => {\r\n    const checkbox = event.target;\r\n    const row = checkbox.parentElement;\r\n    if (!row)\r\n        return;\r\n    const pc = row.dataset.pc;\r\n    if (!pc)\r\n        return;\r\n    if (checkbox.checked) {\r\n        breakpoints.add(+pc);\r\n        row.classList.add('bp');\r\n    }\r\n    else {\r\n        breakpoints.delete(+pc);\r\n        row.classList.remove('bp');\r\n    }\r\n});\r\nMousetrap.bind('mod+b', event => {\r\n    event.preventDefault();\r\n    if (window.machine) {\r\n        breakpoints.add(window.machine.cpu.pc);\r\n        const row = clusterRom.content_elem.querySelector(`[data-pc=\"${window.machine.cpu.pc}\"]`);\r\n        if (row instanceof HTMLElement) {\r\n            row.classList.add('bp');\r\n            row.querySelector('input').checked = true;\r\n        }\r\n    }\r\n});\r\nMousetrap.bind('mod+shift+b', event => {\r\n    event.preventDefault();\r\n    if (window.machine) {\r\n        const where = +(prompt('Where in ROM should be breakpoint be set?', window.machine.cpu.pc.toString()) || '');\r\n        if (!Number.isNaN(where)) {\r\n            breakpoints.add(where);\r\n            const row = clusterRom.content_elem.querySelector(`[data-pc=\"${where}\"]`);\r\n            if (row instanceof HTMLElement) {\r\n                row.classList.add('bp');\r\n                row.querySelector('input').checked = true;\r\n            }\r\n        }\r\n    }\r\n});\r\nconst clusterRam = new Clusterize({\r\n    rows: [],\r\n    scrollElem: $('#ram .clusterize-scroll'),\r\n    contentElem: $('#ram .clusterize-content')\r\n});\r\nMousetrap.bind('mod+h', event => {\r\n    event.preventDefault();\r\n    const address = +(prompt(\"Which RAM address?\") || '');\r\n    Object(_gui__WEBPACK_IMPORTED_MODULE_2__[\"ensureVisible\"])(clusterRam.scroll_elem, address * 24);\r\n});\r\nconst clusterStack = new Clusterize({\r\n    rows: [],\r\n    scrollElem: $('#stack .clusterize-scroll'),\r\n    contentElem: $('#stack .clusterize-content'),\r\n});\r\nfileUpload.addEventListener('change', () => {\r\n    if (fileUpload.files && fileUpload.files[0]) {\r\n        loadFile(fileUpload.files[0]);\r\n    }\r\n}, { passive: true });\r\nMousetrap.bind('mod+o', event => {\r\n    event.preventDefault();\r\n    fileUpload.click();\r\n});\r\nfunction loadFile(file) {\r\n    const reader = new FileReader();\r\n    reader.addEventListener('load', () => {\r\n        window.fileText = reader.result;\r\n        load(window.fileText);\r\n    }, { passive: true });\r\n    reader.readAsText(file);\r\n}\r\nfunction load(text) {\r\n    var _a;\r\n    try {\r\n        const instructions = (_a = text === null || text === void 0 ? void 0 : text.split('\\n').map(l => l.trim()).filter(Boolean).map(_instruction__WEBPACK_IMPORTED_MODULE_0__[\"parse\"])) !== null && _a !== void 0 ? _a : [];\r\n        setupEmulator(instructions);\r\n    }\r\n    catch (error) {\r\n        alert(error.message);\r\n    }\r\n}\r\nfunction setupEmulator(instructions) {\r\n    cancelRun();\r\n    window.machine = new _machine__WEBPACK_IMPORTED_MODULE_1__[\"Machine\"](instructions);\r\n    step(0);\r\n    if (context) {\r\n        context.fillStyle = 'white';\r\n        context.fillRect(0, 0, canvas.width, canvas.height);\r\n    }\r\n}\r\nfunction refreshGui(m) {\r\n    updateReg();\r\n    clusterRom.update(m.rom.map((inst, i) => {\r\n        let html = `<div data-pc=\"${i}\" class=\"row`;\r\n        if (i === m.cpu.pc) {\r\n            html += ' hl';\r\n        }\r\n        if (breakpoints.has(i)) {\r\n            html += ' bp';\r\n        }\r\n        html += '\"><input type=\"checkbox\"';\r\n        if (breakpoints.has(i)) {\r\n            html += ' checked';\r\n        }\r\n        return `${html}><strong>${i}</strong><span>${inst.emit()}</span></div>`;\r\n    }));\r\n    Object(_gui__WEBPACK_IMPORTED_MODULE_2__[\"ensureVisible\"])(clusterRom.scroll_elem, 24 * m.cpu.pc);\r\n    const ramNameMap = {\r\n        0: 'SP',\r\n        1: 'LCL',\r\n        2: 'ARG',\r\n        3: 'THIS',\r\n        4: 'THAT',\r\n        5: 'Temp 0',\r\n        6: 'Temp 1',\r\n        7: 'Temp 2',\r\n        8: 'Temp 3',\r\n        9: 'Temp 4',\r\n        10: 'Temp 5',\r\n        11: 'Temp 6',\r\n        12: 'Temp 7',\r\n        13: 'R13',\r\n        14: 'R14',\r\n        15: 'R15',\r\n        16384: 'SCREEN',\r\n        24576: 'KBD'\r\n    };\r\n    const getName = (i) => ramNameMap[i] ? `${i} | ${ramNameMap[i]}` : `${i}`;\r\n    clusterRam.update(m.ram.map((ram, i) => {\r\n        if (i === m.cpu.a) {\r\n            return `<div class=\"row hl\"><strong>${getName(i)}</strong><span>${toDecimal(ram)}</span></div>`;\r\n        }\r\n        return `<div class=\"row\"><strong>${getName(i)}</strong><span>${toDecimal(ram)}</span></div>`;\r\n    }));\r\n    Object(_gui__WEBPACK_IMPORTED_MODULE_2__[\"ensureVisible\"])(clusterRam.scroll_elem, 24 * m.cpu.a);\r\n    clusterStack.update(m.ram.slice(256, m.ram[0] + 5).map((ram, i) => {\r\n        if (i + 256 === m.ram[0]) {\r\n            return `<div class=\"row hl\"><strong>${i + 256}</strong><span>${toDecimal(ram)}</span></div>`;\r\n        }\r\n        return `<div class=\"row\"><strong>${i + 256}</strong><span>${toDecimal(ram)}</span></div>`;\r\n    }));\r\n    Object(_gui__WEBPACK_IMPORTED_MODULE_2__[\"ensureVisible\"])(clusterStack.scroll_elem, 24 * (m.ram[0] - 256));\r\n}\r\nfunction updateReg() {\r\n    const machine = window.machine;\r\n    if (!machine)\r\n        return;\r\n    dValue.textContent = toDecimal(machine.cpu.d);\r\n    aValue.textContent = toDecimal(machine.cpu.a);\r\n    mValue.textContent = machine.cpu.a <= 0x7fff ? toDecimal(machine.cpu.m) : 'Out of bounds';\r\n    pcValue.textContent = toDecimal(machine.cpu.pc);\r\n}\r\nfunction step(n) {\r\n    const m = window.machine;\r\n    if (!m)\r\n        return;\r\n    try {\r\n        for (let i = 0; i < n; i++) {\r\n            m.step();\r\n            if (m.cpu.a >= SCREEN && m.cpu.a < 0x7fff && context) {\r\n                const y = Math.floor((m.cpu.a - SCREEN) / 32);\r\n                const xStart = ((m.cpu.a) - SCREEN - y * 32);\r\n                const mem = m.cpu.m;\r\n                for (let i = 0; i < 16; i++) {\r\n                    context.fillStyle = mem & (1 << i) ? 'black' : 'white';\r\n                    context.fillRect(xStart + i, y, 1, 1);\r\n                }\r\n            }\r\n            if (breakpoints.has(m.cpu.pc)) {\r\n                break;\r\n            }\r\n        }\r\n    }\r\n    catch (err) {\r\n        alert(err.message);\r\n    }\r\n    finally {\r\n        refreshGui(m);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/instruction.ts":
/*!****************************!*\
  !*** ./src/instruction.ts ***!
  \****************************/
/*! exports provided: parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"parse\", function() { return parse; });\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ \"./src/util.ts\");\n\r\nfunction makeA(value) {\r\n    return {\r\n        type: 'a',\r\n        eval: cpu => {\r\n            cpu.a = value;\r\n            cpu.pc++;\r\n        },\r\n        emit: () => `@${value}`\r\n    };\r\n}\r\nconst DEST_MAP = [\r\n    '',\r\n    'M=',\r\n    'D=',\r\n    'MD=',\r\n    'A=',\r\n    'AM=',\r\n    'AD=',\r\n    'AMD='\r\n];\r\nconst JUMP_MAP = [\r\n    '',\r\n    ';JGT',\r\n    ';JEQ',\r\n    ';JGE',\r\n    ';JLT',\r\n    ';JNE',\r\n    ';JLE',\r\n    ';JMP'\r\n];\r\n// Only a few instructions are standard. Non standard instructions are mapped\r\n// either to a custom mnemonic (chosen for simplicity) or to X instructions.\r\nconst X = Symbol();\r\nconst COMP_MAP = [\r\n    'D&A',\r\n    '!(D&A)',\r\n    'D+A',\r\n    X,\r\n    'D&!A',\r\n    '!(D&!A)',\r\n    X,\r\n    'A-D',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    'D',\r\n    '!D',\r\n    'D-1',\r\n    '~D',\r\n    '!D&A',\r\n    'D|!A',\r\n    X,\r\n    'D-A',\r\n    '!D&!A',\r\n    'D|A',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    'D+1',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    '0',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    'A',\r\n    '!A',\r\n    'A-1',\r\n    '~A',\r\n    X,\r\n    X,\r\n    X,\r\n    'A+1',\r\n    X,\r\n    X,\r\n    '-1',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    '1',\r\n    'D&M',\r\n    '!(D&M)',\r\n    'D+M',\r\n    X,\r\n    'D&!M',\r\n    '!D|M',\r\n    X,\r\n    'M-D',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    '!D&M',\r\n    'D|!M',\r\n    X,\r\n    'D-M',\r\n    '!D&!M',\r\n    'D|M',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    'M',\r\n    '!M',\r\n    'M-1',\r\n    '~M',\r\n    X,\r\n    X,\r\n    X,\r\n    'M+1',\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n    X,\r\n].map((v, i) => v === X ? `X${i.toString(16).toUpperCase()}` : v);\r\nfunction makeC(comp, dest, jump) {\r\n    return {\r\n        type: 'c',\r\n        eval: cpu => {\r\n            let x = cpu.d;\r\n            let y = comp & 0b1000000 ? cpu.m : cpu.a;\r\n            if (comp & 0b0100000) {\r\n                x = 0;\r\n            }\r\n            if (comp & 0b0010000) {\r\n                x = (~x) & 0xFFFF;\r\n            }\r\n            if (comp & 0b0001000) {\r\n                y = 0;\r\n            }\r\n            if (comp & 0b0000100) {\r\n                y = (~y) & 0xFFFF;\r\n            }\r\n            let out = comp & 0b0000010 ? (x + y) & 0xFFFF : x & y;\r\n            if (comp & 0b0000001) {\r\n                out = (~out) & 0xFFFF;\r\n            }\r\n            // Order matters - m before a.\r\n            if (dest & 0b001) {\r\n                cpu.m = out;\r\n            }\r\n            if (dest & 0b010) {\r\n                cpu.d = out;\r\n            }\r\n            if (dest & 0b100) {\r\n                cpu.a = out;\r\n            }\r\n            const neg = out & 0x8000;\r\n            const zero = out === 0;\r\n            // LT EQ GT\r\n            const cmp = (neg ? 0b100 : 0)\r\n                | (zero ? 0b010 : 0)\r\n                | (!neg && !zero ? 0b001 : 0);\r\n            if (jump & cmp) {\r\n                cpu.pc = cpu.a;\r\n            }\r\n            else {\r\n                cpu.pc++;\r\n            }\r\n        },\r\n        emit: () => `${DEST_MAP[dest]}${COMP_MAP[comp]}${JUMP_MAP[jump]}`\r\n    };\r\n}\r\nfunction parse(instruction) {\r\n    Object(_util__WEBPACK_IMPORTED_MODULE_0__[\"assert\"])(/^[01]{16}$/.test(instruction), `Instruction '${instruction}' does not match format.`);\r\n    if (instruction[0] === '0') {\r\n        return makeA(parseInt(instruction, 2));\r\n    }\r\n    const comp = parseInt(instruction.substr(3, 7), 2);\r\n    const dest = parseInt(instruction.substr(10, 3), 2);\r\n    const jump = parseInt(instruction.substr(13, 3), 2);\r\n    return makeC(comp, dest, jump);\r\n}\r\n\n\n//# sourceURL=webpack:///./src/instruction.ts?");

/***/ }),

/***/ "./src/machine.ts":
/*!************************!*\
  !*** ./src/machine.ts ***!
  \************************/
/*! exports provided: Machine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Machine\", function() { return Machine; });\n/* harmony import */ var _cpu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cpu */ \"./src/cpu.ts\");\n/* harmony import */ var _instruction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instruction */ \"./src/instruction.ts\");\n\r\n\r\nclass Machine {\r\n    constructor(instructions) {\r\n        this._ticks = 0;\r\n        this.cpu = new _cpu__WEBPACK_IMPORTED_MODULE_0__[\"CPU\"]();\r\n        this.histogram = Array.from({ length: 2 ** 15 }).fill(0);\r\n        const rom = instructions.slice();\r\n        while (rom.length < 2 ** 15) {\r\n            rom.push(Object(_instruction__WEBPACK_IMPORTED_MODULE_1__[\"parse\"])('0000000000000000'));\r\n        }\r\n        this.rom = rom;\r\n    }\r\n    get ram() {\r\n        return this.cpu.ram;\r\n    }\r\n    get ticks() {\r\n        return this._ticks;\r\n    }\r\n    step() {\r\n        this._ticks++;\r\n        this.histogram[this.cpu.pc]++;\r\n        this.rom[this.cpu.pc].eval(this.cpu);\r\n    }\r\n    toString() {\r\n        return `Machine { a = ${this.cpu.a}, d = ${this.cpu.d}, m = ${this.cpu.m}, pc = ${this.cpu.pc}}`;\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/machine.ts?");

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/*! exports provided: assert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"assert\", function() { return assert; });\nfunction assert(arg, message = 'Failed assert') {\r\n    if (!arg) {\r\n        throw new Error(message);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/util.ts?");

/***/ })

/******/ });