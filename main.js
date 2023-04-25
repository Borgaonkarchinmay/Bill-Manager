const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const mysql = require('mysql');

const db = mysql.createConnection({
    user : "root",
    host : "localhost",
    password : "Chinmaypb@1032",
    database : "studentsdb",
    multipleStatements: true,
});


const createWindow = () =>{
    const win = new BrowserWindow({
        width : 800,
        height : 600,
        webPreferences : { // Injects the preload script before the webpage is loaded into the window
            preload : path.join(__dirname, 'preload.js'),
        },
    })
    win.webContents.openDevTools()

    win.loadFile('index.html')

    /*
    const content = win.webContents
    console.log(content)
    */
}


// Call createWindow() function when app is ready
// Special .whenReady helper function by electron to assure readyness of the app
app.whenReady().then( () =>{

    // Listen to stuFormData channel for stu-form save event 
    ipcMain.on('stuFormData:save', (event, student) =>{
        const name = student.name
        const age = student.age
        const rollno = student.rollno
        const branch = student.branch
        
        const querry = 'INSERT INTO STUDENT VALUES(?, ?, ?, ?)'

        db.query(querry, [name, age, rollno, branch], (err, result) =>{
            if(err)
                console.log(`Oops error! ${err}`)
            else{
                console.log(result)
            }
        })
    })

    
    ipcMain.handle('stuFormData:fetch', (event) =>{
        
        return new Promise((resolve, reject) =>{
            const querry = 'SELECT * FROM STUDENT'
            
            db.query(querry, (err, res) =>{
                if(err){
                    console.log(`Oops error! ${err}`)
                    reject(err)
                }else{
                    var rows = JSON.parse(JSON.stringify(res))
                    resolve(rows)
                    console.log(rows)
                }
            })
        })
        
    })

    ipcMain.handle('fill-bill:select', (event) =>{

        return new Promise( (resolve, reject) =>{

            const webContents = event.sender
            const win = BrowserWindow.fromWebContents(webContents)

            // Open file selection dialog box
            dialog.showOpenDialog({
                win, // Attach the OS dialog the concerned window
                properties: ['openFile'], // Restrict only to file selection
                filters: [
                    { name: 'Images', extensions: ['jpg', 'png', 'gif'] }, // Allow view and selection of these image formated only
                ]
            }).then( (result) =>{
                
                // Something selected
                if(!result.canceled){
                    console.log(`Selected file path is :${result.filePaths[0]}`)
                    resolve(result.filePaths[0])
                }else{
                    // Return empty file path
                    resolve("")
                }
                
            }).catch( (error) =>{

                console.log(`Error is :${error}`)
                reject(error)
            })
            
        })

    })

    createWindow()    
})

// Close the app when all the windows are closed
app.on('window-all-closed', () =>{
    if(process.platform != 'darwin')
        app.quit() // Allowed iff OS : Windows | Linux
})