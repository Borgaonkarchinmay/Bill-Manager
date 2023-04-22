const {contextBridge, ipcRenderer} = require('electron')

    
contextBridge.exposeInMainWorld('versions', {
    chrome : () => process.versions.node,
    electron : () => process.versions.electron,
    node : () => process.versions.node,
})