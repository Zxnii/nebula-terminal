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

let cwd = os.homedir()

const sendCommand = (input) => {
    const strings = input.split(/(\"+)/)
    for (let i = 0; i < strings.length; i++) {
        const string = strings[i]
        if (string == "\"" && strings[i + 2] == "\"") {
            strings[i] = `"${strings[i + 1]}"`
            strings.splice(i + 1, 2)
        }
    }
    const args = []
    for (const string of strings) {
        if (!/\"(.*)\"/.test(string)) {
            const split = string.split(" ")
            for (const arg of split) {
                if (arg != "")
                    args.push(arg)
            }
        } else {
            args.push(string)
        }
    }
    const terminal = document
        .querySelector("#terminal") 

    const commandOutput = document
        .createElement("span")

    commandOutput.innerText = "\n"

    terminal.appendChild(commandOutput)

    const command = args.splice(0, 1)[0]
    console.log(command)
    console.log(args)

    if (command == "cd" && args.length > 0) {
        const originalCwd = cwd
        if (path.isAbsolute(args[0]))
            cwd = args[0]
        else
            cwd = path.join(cwd, args[0])

        if (!fs.existsSync(cwd)) {
            commandOutput.innerText += "The system couldn't find the path specified."
            cwd = originalCwd
        }
        cwd = cwd.replace(/\//g, "\\")
        createPrompt()
        return
    } 

    const spawned = spawn(command, args, {
        cwd,
        shell: true
    })

    spawned.on("error", (err) => {
        createPrompt()
        console.log(err.message)
    })
    spawned.on("exit", () => {
        createPrompt()
    })

    spawned.stdout.on("data", (chunk) => {
        chunk = chunk.toString()
        commandOutput.innerText += chunk
    })
    spawned.stderr.on("data", (chunk) => {
        commandOutput.innerText += chunk
        spawned.kill("SIGKILL")
    })
}

const createPrompt = () => {
    const terminal = document
        .querySelector("#terminal")
    const strLength = document
        .querySelector("#str-length")

    const begin = document
        .createElement("span")
    begin.className = "prompt-before"
    begin.innerHTML = `\n<span class="bracket">〉</span><span class="cwd">${cwd}</span> #`
    const input = document
        .createElement("div")
    const caret = document
        .createElement("div")
    const realInput = document
        .createElement("input")
    const inputDisplay = document
        .createElement("span")

    input.className = "prompt"
    caret.id = "caret"
    realInput.id = "real-input"

    inputDisplay.className = "prompt-input"

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
    realInput.addEventListener("keyup", (e) => {
        inputDisplay.textContent = realInput.value
        strLength.innerText = realInput.value.substr(0, realInput.selectionStart)
        caret.style.left = `${strLength.clientWidth}px`
        if (e.which == 13) {
            sendCommand(realInput.value)
            caret.remove()
            realInput.remove()
        }
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