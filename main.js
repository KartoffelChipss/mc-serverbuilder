const { app, BrowserWindow, Tray, Notification, dialog, nativeImage, Menu, shell, screen, nativeTheme } = require('electron')
const path = require('path')
const fetch = require('cross-fetch');
const { ipcMain } = require('electron/main');
const Store = require('electron-store');
const fs = require("fs");

let top = {};

const store = new Store({
    "servers": []
})

app.whenReady().then(async () => {
    if (process.platform === 'win32') {
        app.setAppUserModelId("MC Serverbuilder");
    }

    const screenHeight = screen.getPrimaryDisplay().workAreaSize.height;
    const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;

    top.mainWindow = new BrowserWindow({
        title: "MC Serverbuilder",
        height: screenHeight / 2,
        width: screenWidth / 2,
        minHeight: 400,
        minWidth: 475,
        center: true,
        frame: false,
        show: false,
        backgroundColor: "#282a2d",
        resizable: true,
        autoHideMenuBar: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    top.mainWindow.loadFile("public/main.html");

    top.mainWindow.show();

    ipcMain.handle("minimize", (event, args) => {
        if (args.window === "main") {
            top.mainWindow.isMinimized() ? top.mainWindow.restore() : top.mainWindow.minimize();
        } else if (args.window === "create") {
            top.createWindow.isMinimized() ? top.createWindow.restore() : top.createWindow.minimize();
        }
    });

    ipcMain.handle('togglemaxwindow', (event, arg) => {
        if (arg.window === "main") {
            top.mainWindow.isMaximized() ? top.mainWindow.unmaximize() : top.mainWindow.maximize();
        } else if (arg.window === "create") {
            top.createWindow.isMaximized() ? top.createWindow.unmaximize() : top.createWindow.maximize();
        }
    });

    ipcMain.handle('closeWindow', (event, arg) => {
        if (arg.window === "main") {
            top.mainWindow.close();
        } else if (arg.window === "create") {
            top.createWindow.close();
        }
    });

    ipcMain.handle("openCreateWindow", (event, args) => {
        top.createWindow = new BrowserWindow({
            title: "MC Serverbuilder",
            height: Math.floor(screenHeight * 0.6),
            width: Math.floor(screenWidth * 0.6),
            minHeight: 400,
            minWidth: 475,
            center: true,
            frame: false,
            show: false,
            backgroundColor: "#282a2d",
            resizable: true,
            autoHideMenuBar: false,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegration: false,
                contextIsolation: true,
            }
        });

        top.createWindow.loadFile("public/create.html");
        top.createWindow.show();
    })

    ipcMain.handle('dialog:openDirectory', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog(top.createWindow, {
            properties: ['openDirectory']
        });
        if (canceled) {
            return
        } else {
            return filePaths[0]
        }
    })

    ipcMain.handle("finishCreate", (e, data) => {
        let servername = data.servername
        let safename = servername.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        console.log(safename)
        if (!fs.existsSync(data.location + path.sep + safename)) fs.mkdir(data.location + path.sep + safename, () => {});

        console.log(data.location + path.sep + safename)
    });
})