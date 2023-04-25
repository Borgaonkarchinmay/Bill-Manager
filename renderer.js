const btnSave = document.getElementById('btn-save')
const btnFetch = document.getElementById('btn-fetch')
const btnScan = document.getElementById('btn-scan')

// Asynchronous event listeners 
// So that user can seemlesly interact with the UI
// awaiting for the application t complete with previous requests

btnSave.addEventListener('click', async () =>{
    const name = document.getElementById('stu-name').value
    const age = document.getElementById('stu-age').value
    const rollno = document.getElementById('stu-rollno').value
    const branch = document.getElementById('stu-branch').value
    
    const result = await stuFormData.saveStudentData(name, age, rollno, branch) // Pass data to mediator (preload)
    document.getElementById('stu-name').value = ''
    document.getElementById('stu-age').value = ''
    document.getElementById('stu-rollno').value = ''
    document.getElementById('stu-branch').value = ''

    console.log(result) 
})


btnFetch.addEventListener('click', async () =>{

    var result = await stuFormData.showStuData()
    console.log(result)
    

    const stuTableBody = document.getElementById('stu-records-tab-content')
    const keySet = Object.keys(result[0])

    result.forEach(student => {
        const row = document.createElement('tr')

        keySet.forEach(key => {
            const cell = document.createElement('td')
            cell.innerText = student[key]
            row.appendChild(cell)
        })

        stuTableBody.appendChild(row)
    })

})

btnScan.addEventListener('click', async () =>{
    const filePath = await stuFormData.selectBill()
    const billContainer = document.getElementById('scanned-billed')
    billContainer.src = filePath
    console.log(`Selected filepath is: ${filePath}`)
})
