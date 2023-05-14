const btnSave = document.getElementById('btn-save')
const btnFetch = document.getElementById('btn-fetch')
const btnScan = document.getElementById('btn-scan')
const btnDelete = document.getElementById('btn-delete')
const gstNo = document.getElementById('gst-no')
const btnVerifyGST = document.getElementById('btn-verify-gstno')
const gstStatus = document.getElementById('gst-status')

// Asynchronous event listeners 
// So that user can seemlesly interact with the UI
// awaiting for the application t complete with previous requests

/*
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
})*/

/*
btnSave.addEventListener('click', async () =>{
    /*const name = document.getElementById('stu-name').value
    const age = document.getElementById('stu-age').value
    const rollno = document.getElementById('stu-rollno').value
    const branch = document.getElementById('stu-branch').value
    
    const result = await stuFormData.saveStudentData(name, age, rollno, branch) // Pass data to mediator (preload)
    document.getElementById('stu-name').value = ''
    document.getElementById('stu-age').value = ''
    document.getElementById('stu-rollno').value = ''
    document.getElementById('stu-branch').value = ''

    const result = await stuFormData.saveEssentialInvoiceData('merchant_name', 'merchant_pan', 'merchant_gst', 'merchant_mob_no', 'total_amount') // Pass data to mediator (preload)
    console.log('renderer result data: ')
    console.log(result) 
})*/

btnSave.addEventListener('click', async () =>{


    //Expected arguments mentioned as strings
    //const result = await invoiceManager.saveAllInvoiceDataFields(merchant_name, invoice_date_time, merchant_pan, merchant_gst, merchant_mob_no, total_amount, website, country, payment_method, payment_status) // Pass data to mediator (preload)
    //const result = await invoiceManager.saveEssentialInvoiceData(merchant_name, merchant_pan, merchant_gst, merchant_mob_no, total_amount) // Pass data to mediator (preload)
    console.log('renderer result data: ')
    
    /*
    Note 
    invoice_date_time parameter compulsory format : data type = string
    format => yyyy-mm-dd hh:mm:ss
    */
    
    console.log(result) 
})

/*
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

})*/

btnFetch.addEventListener('click', async () =>{
    // Respone : All invoices in the db are fetched
    // Response Structure : [{}, ...]

    console.log('renderer btn fetch')
    var result = await invoiceManager.showInvoiceData()
    console.log(result)
    
})

btnDelete.addEventListener('click', async () =>{
    
    console.log('renderer btn delete')
    var result = await invoiceManager.deleteInvoiceRecord(2)
    console.log(result)
    
})

btnScan.addEventListener('click', async () =>{
    // Only response structure of concern here is => console.log(`Bill content: ${billData}`) 


    const filePath = await invoiceManager.selectBill()
    const billContainer = document.getElementById('scanned-billed')
    billContainer.src = filePath
    console.log(`Selected filepath is: ${filePath}`)
    console.log()

    const billData = await invoiceManager.executeOCR(filePath)
    console.log(`Bill content: ${billData}`)

})


btnVerifyGST.addEventListener('click', async () =>{
    // Response structure : { status : 'active'/'deactive'}

    console.log(`In renderer gstNo: ${gstNo.value}`)
    const result = await invoiceManager.verifyGST(gstNo.value)
    console.log(`Result : ${result}`)
    gstStatus.innerText = result.status;
})

/*


Electron previledge API call flow

-> JS of html file -- calls -> preloadjs(mediator | It exposes priviledged apis using context bridge) defined methods/apis
    These apis exposed as 'invoiceManager' object having relevant functions as its methods 

-> Preloadjs -> context bridge -> accepts the params from above step prepares data as required by main process
                and call relevant ipc channel

            Returns response of main process to renderer process

*/
