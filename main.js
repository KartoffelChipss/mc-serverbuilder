const {app, BrowserWindow, Tray, Notification, dialog, nativeImage, Menu, shell, screen, nativeTheme} = require('electron')
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
            height: Math.floor(screenHeight * 0.75),
            width: Math.floor(screenWidth * 0.75),
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
})