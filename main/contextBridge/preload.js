const {contextBridge, ipcRenderer} = require('electron')

// Access previledged API's
// Call the appropriate main process functions
// Expose necessary API's to renderer process and enable IPC communication


const saveEssentialInvoiceData = async (merchant_name, merchant_pan, merchant_gst, merchant_mob_no, total_amount) =>{
    
    // Renderer -> Main 1 way communication pattern

    invoice = {merchant_name, merchant_pan, merchant_gst, merchant_mob_no, total_amount}
    const result = await ipcRenderer.invoke('invoice_essential_fields:save', invoice)

    return result
}

const saveAllInvoiceDataFields = async (merchant_name, invoice_date_time, merchant_pan, merchant_gst, merchant_mob_no, total_amount, website, country, payment_method, payment_status) =>{
    
    // Renderer -> Main 1 way communication pattern

    invoice = {merchant_name, invoice_date_time, merchant_pan, merchant_gst, merchant_mob_no, total_amount, website, country, payment_method, payment_status}
    const result = await ipcRenderer.invoke('invoice_all_fields:save', invoice)

    return result
}

const showInvoiceData = async() =>{
    console.log('preload btn fetch')
    // Renderer -> Main 2 way communication pattern
    var invoiceRecords = []

    invoiceRecords = await ipcRenderer.invoke('invoice:fetch')
    
    return invoiceRecords
}

const deleteInvoiceRecord = async(invoice_id) =>{
    console.log('preload btn delete')
    // Renderer -> Main 2 way communication pattern

    const result = await ipcRenderer.invoke('invoice:delete', parseInt(invoice_id))
    
    return result
}

const selectBill = async () =>{
    
    const filePath = await ipcRenderer.invoke('fill-bill:select')
    return filePath
}

const verifyGST = async (gstNo) =>{
    console.log(`In preload gstNo: ${gstNo}`)
    const result = await ipcRenderer.invoke('bill-gst:verify', gstNo)
    return result
}

const executeOCR = async (imageFilePath) =>{
    console.log(`In preload gstNo: ${imageFilePath}`)
    const result = await ipcRenderer.invoke('fill-bill:executeOCR', imageFilePath)
    return result
}

// Expose the relevant functions and variables to renderer process  

contextBridge.exposeInMainWorld('invoiceManager', {
    selectBill : selectBill,
    verifyGST : verifyGST,
    executeOCR : executeOCR,
    showInvoiceData : showInvoiceData,
    saveEssentialInvoiceData : saveEssentialInvoiceData,
    saveAllInvoiceDataFields : saveAllInvoiceDataFields,
    deleteInvoiceRecord : deleteInvoiceRecord
})