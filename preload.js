const {contextBridge, ipcRenderer} = require('electron')

// Access previledged API's
// Call the appropriate main process functions
// Expose necessary API's to renderer process and enable IPC communication

const saveStudentData = (name, age, rollno, branch) =>{
    
    // Renderer -> Main 1 way communication pattern

    student = {name, age, rollno, branch}
    ipcRenderer.send('stuFormData:save', student)

    return true
}

const showStuData = async() =>{

    // Renderer -> Main 2 way communication pattern
    var studentRecords = []

    studentRecords = await ipcRenderer.invoke('stuFormData:fetch')
    
    return studentRecords
}

// Expose the relevant functions and variables to renderer process  

contextBridge.exposeInMainWorld('stuFormData', {
    saveStudentData : saveStudentData,
    showStuData : showStuData,
})