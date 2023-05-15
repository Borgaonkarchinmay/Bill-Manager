const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const dbAct = require('./Database/dbActivities')
const utilities = require('./utils/utils')

const createWindow = () =>{
    const win = new BrowserWindow({
        width : 1000,
        height : 575,
        webPreferences : { // Injects the preload script before the webpage is loaded into the window
            preload : path.join(__dirname, 'contextBridge/preload.js'),
            contextIsolation: true,
            worldSafeExecuteJavaScript: true,
        },
    })
    // win.webContents.openDevTools()

    win.loadFile(path.join(__dirname, '../renderer/index.html'))
}

(async () => {
    // Call createWindow() function when app is ready
    // Special .whenReady helper function by electron to assure readyness of the app
    await app.whenReady();
  
    createWindow()    
})();


ipcMain.handle('invoice_essential_fields:save', async (event, invoice) =>{
    console.log('essential all')
    return await dbAct.save_essential_invoice_fields(invoice)
})

ipcMain.handle('invoice_all_fields:save', async (event, invoice) =>{
    console.log('save all')
    return await dbAct.save_all_invoice_fields(invoice)
})

ipcMain.handle('invoice:fetch', async (event) =>{
    console.log('main btn fetch')
    return await dbAct.fetch_all_invoices()
})

ipcMain.handle('invoice:delete', async (event, invoice_id) =>{
    console.log('main btn delete')
    return await dbAct.delete_a_invoice(invoice_id)
})

ipcMain.handle('fill-bill:select', async (event) =>{
    console.log('reached main process')
    return await utilities.open_file_dialog(event)
})

ipcMain.handle('fill-bill:executeOCR', async (event, imageFilePath) =>{
    console.log('reached main process')
    return await utilities.executeOCR(imageFilePath)
})

ipcMain.handle('bill-gst:verify', async (event, gstNo) =>{

    console.log(`Reached main process`)
    return await utilities.verify_gst(gstNo)
})

// Close the app when all the windows are closed
app.on('window-all-closed', () =>{
    if(process.platform != 'darwin')
        app.quit() // Allowed iff OS : Windows | Linux
})