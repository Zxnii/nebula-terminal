const {
    app,
    BrowserWindow
} = require("electron")

const os = require("os"),
    fs = require("fs"),
    path = require("path")

const setup = () => {
    const isLinux = process.platform == "linux"
    console.log(isLinux)
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: isLinux,
        icon: "./resources/icons/icon_256.png",
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    window.loadURL(path.join(__dirname, "terminal.htm"))
}

app.on("ready", () => {
    setup()
})