
const btnSave = document.getElementById('btn-save')
const btnFetch = document.getElementById('btn-fetch')
const btnUpload = document.getElementById('btn-upload')
const invoiceRecordsTableBody = document.getElementById('invoice-records-table-body')

//const gstNo = document.getElementById('gst-no')
const btnVerifyGST = document.getElementById('btn-verify-gstno')
const gstStatus = document.getElementById('gst-status')
const merchant_country = document.getElementById('merchant_country')
const merchant_website = document.getElementById('merchant_website')
const merchant_amount = document.getElementById('merchant_amount')
const merchant_gst_no = document.getElementById('merchant_gst_no')
const merchant_name = document.getElementById('merchant_name')
const merchant_date = document.getElementById('merchant_date')
const merchant_MobNo = document.getElementById('merchant_MobNo')
const payment_method = document.getElementById('payment_method')
const payment_status = document.getElementById('payment_status')
const merchant_pan = document.getElementById('merchant_pan')

// Asynchronous event listeners 
// So that user can seemlesly interact with the UI
// awaiting for the application t complete with previous requests


btnSave.addEventListener('click', async () =>{

//  Expected arguments mentioned as strings
    const result = await invoiceManager.saveAllInvoiceDataFields(merchant_name.value, merchant_date.value, merchant_pan.value, merchant_gst_no.value, merchant_MobNo.value, merchant_amount.value, merchant_website.value, merchant_country.value, payment_method.value, payment_status.value) // Pass data to mediator (preload)

    console.log('renderer result data: ')
    console.log(result)

//     Note 
//     invoice_date_time parameter compulsory format : data type = string
//     format => yyyy-mm-dd hh:mm:ss
//     
})

btnFetch.addEventListener('click', async () =>{

    console.log('renderer btn fetch')
    var result = await invoiceManager.showInvoiceData()
    if(result.length){

        const keySet = Object.keys(result[0])

        // Clear the table content
        invoiceRecordsTableBody.innerHTML = ''

        // Populate table
        result.forEach(invoice => {
            const row = document.createElement('tr')

            keySet.forEach(key => {
                const cell = document.createElement('td')
                cell.innerText = invoice[key]
                row.appendChild(cell)
            })

            invoiceRecordsTableBody.appendChild(row)
        })
    }else{
        // Clear the table content
        invoiceRecordsTableBody.innerHTML = ''
    }
})

// btnDelete.addEventListener('click', async () =>{
    
//     console.log('renderer btn delete')
//     var result = await invoiceManager.deleteInvoiceRecord(2)
//     console.log(result)
    
// })

btnUpload.addEventListener('click', async () =>{
    // Only response structure of concern here is => console.log(`Bill content: ${billData}`) 
    try{

        const filePath = await invoiceManager.selectBill()
        const billContainer = document.getElementById('scanned-billed')
        //billContainer.src = filePath
        //console.log(`Selected filepath is: ${filePath}`)
        console.log()

        var billData = await invoiceManager.executeOCR(filePath)
        console.log(`Bill content: ${billData}`)
        billData = JSON.parse(billData)
        console.log(billData.GST)
        console.log(typeof(billData.GST))

        // auto fill
        merchant_country.value = billData.Country
        merchant_pan.value = billData.GST.substring(2, 12)
        merchant_website.value = billData.Website
        merchant_amount.value = billData.TotalBillAmount
        merchant_gst_no.value = billData.GST
        merchant_name.value = billData.MerchantName
        merchant_date.value = billData.merchant_date
        merchant_MobNo.value = billData.MobNo
    
    }catch(err){
        console.log('User did\'t selected the file')
    }    
})


btnVerifyGST.addEventListener('click', async () =>{
    // Response structure : { status : 'active'/'deactive'}
    try{
        console.log(`In renderer gstNo: ${merchant_gst_no.value}`)
        const result = await invoiceManager.verifyGST(merchant_gst_no.value)
        console.log(`Result : ${result}`)
        gstStatus.innerText = result.status;
    }catch(err){
        console.log(err)
    }
})

/*


Electron previledge API call flow

-> JS of html file -- calls -> preloadjs(mediator | It exposes priviledged apis using context bridge) defined methods/apis
    These apis exposed as 'invoiceManager' object having relevant functions as its methods 

-> Preloadjs -> context bridge -> accepts the params from above step prepares data as required by main process
                and call relevant ipc channel

            Returns response of main process to renderer process

*/