const {app, BrowserWindow, Tray, Notification, dialog, nativeImage, Menu, shell, screen, nativeTheme} = require('electron')
const path = require('path')
const fetch = require('cross-fetch');
const { ipcMain } = require('electron/main');
const Store = require('electron-store');
const fs = require("fs");

let top = {};

app.whenReady().then(async () => {
    if (process.platform === 'win32') {
        app.setAppUserModelId("MC Serverbuilder");
    }

    const screenHeight = screen.getPrimaryDisplay().workAreaSize.height;

    let windowWidth = 800;
    let windowHeight = 600;

    if (screenHeight < 1300) {
        windowWidth = 600;
        windowHeight = 450;
    }

    top.mainWindow = new BrowserWindow({
        title: "MC Serverbuilder",
        height: windowHeight,
        width: windowWidth,
        minHeight: 400,
        minWidth: 475,
        center: true,
        frame: false,
        show: false,
        backgroundColor: "#333333",
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
        }
    });

    ipcMain.handle('togglemaxwindow', (event, arg) => {
        if (arg.window === "main") {
            top.mainWindow.isMaximized() ? top.mainWindow.unmaximize() : top.mainWindow.maximize();
        }
    });

    ipcMain.handle('closeWindow', (event, arg) => {
        if (arg.window === "main") {
            top.mainWindow.close();
        }
    });
})