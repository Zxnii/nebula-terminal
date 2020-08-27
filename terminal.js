const { spawn } = require("child_process")

const os = require("os"),
    path = require("path"),
    fs = require("fs")

const isLinux = os.platform() == "linux"

const setupTitlebar = () => {    
    const { Titlebar, Color } = require("custom-electron-titlebar")

    new Titlebar({
        backgroundColor: Color.fromHex("#080808"),
        unfocusEffect: false,
        menuPosition: "bottom",
        icon: "./resources/icons/icon_256.png"
    })
}

let opDir = os.homedir()

const createPrompt = () => {
    const terminal = document
        .querySelector("#terminal")
    const strLength = document
        .querySelector("#str-length")

    const begin = document
        .createElement("span")
    begin.className = "prompt-before"
    begin.innerHTML = `<span class="bracket">〉</span><span class="op-dir">${opDir}</span> #`
    const input = document
        .createElement("div")
    const caret = document
        .createElement("div")
    const realInput = document
        .createElement("input")
    const inputDisplay = document
        .createElement("span")

    input.className="prompt"
    caret.id="caret"
    realInput.id="real-input"

    inputDisplay.className="prompt-input"

    realInput.spellcheck = false

    realInput.addEventListener("keypress", () => {
        inputDisplay.textContent = realInput.value
        strLength.innerText = realInput.value.substr(0, realInput.selectionStart)
        caret.style.left = `${strLength.clientWidth}px`
    })
    realInput.addEventListener("keydown", () => {
        inputDisplay.textContent = realInput.value
        strLength.innerText = realInput.value.substr(0, realInput.selectionStart)
        caret.style.left = `${strLength.clientWidth}px`
    })
    realInput.addEventListener("keyup", () => {
        inputDisplay.textContent = realInput.value
        strLength.innerText = realInput.value.substr(0, realInput.selectionStart)
        caret.style.left = `${strLength.clientWidth}px`
    })
    realInput.addEventListener("mousedown", () => {
        strLength.innerText = realInput.value.substr(0, realInput.selectionStart)
        caret.style.left = `${strLength.clientWidth}px`
    })

    input.appendChild(inputDisplay)
    input.appendChild(realInput)
    input.appendChild(caret)
    
    terminal.appendChild(begin)
    terminal.appendChild(input)

    realInput.focus()
}

createPrompt()

if (!isLinux)
    setupTitlebar()