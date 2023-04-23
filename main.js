const {app, BrowserWindow, ipcMain} = require('electron')
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
    
    createWindow()    
})

// Close the app when all the windows are closed
app.on('window-all-closed', () =>{
    if(process.platform != 'darwin')
        app.quit() // Allowed iff OS : Windows | Linux
})