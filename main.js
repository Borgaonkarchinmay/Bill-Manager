const {app, BrowserWindow} = require('electron')
const path = require('path')

const createWindow = () =>{
    const win = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences : { // Injects the preload script before the webpage is loaded into the window
            preload : path.join(__dirname, 'preload.js'),
        },
    })

    win.loadFile('index.html')

    /*
    const content = win.webContents
    console.log(content)
    */
}


// Call createWindow() function when app is ready
// Special .whenReady helper function by electron to assure readyness of the app
app.whenReady().then( () =>{
    createWindow()    
})

// Close the app when all the windows are closed
app.on('window-all-closed', () =>{
    if(process.platform != 'darwin')
        app.quit() // Allowed iff OS : Windows | Linux
})