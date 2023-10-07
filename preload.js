const {
    contextBridge,
    ipcRenderer
} = require("electron");

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
})

contextBridge.exposeInMainWorld(
    "api", {
        invoke: (channel, data) => {
            let validChannels = ["closeWindow", "minimize", "togglemaxwindow", "openCreateWindow", "finishCreate"];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, data);
            }
        },
        selectFolder: () => ipcRenderer.invoke('dialog:openDirectory')
    }
);

contextBridge.exposeInMainWorld(
    'bridge', {
        // From main to render
        sendStorageData: (message) => {
            ipcRenderer.on('sendStorageData', message);
        },
    }
);