const checkInternetConnected = require('check-internet-connected')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const request = require('request')
const fs = require('fs')
const {BrowserWindow, dialog} = require('electron')
const path = require('path')

exports.executeOCR = async (imageFilePath) =>{
    const receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt'; 
    
    const connectionCheckConfig = {
        timeout: 5000,
        retries: 3,
        domain: 'https://ocr.asprise.com/api'
    }

    try{
        await checkInternetConnected(connectionCheckConfig)

        return new Promise( (resolve, reject) =>{

            request.post({
                url: receiptOcrEndpoint,
                formData: {
                api_key: 'TEST',        // Use 'TEST' for testing purpose
                recognizer: 'auto',        // can be 'US', 'CA', 'JP', 'SG' or 'auto'
                ref_no: 'ocr_nodejs_123', // optional caller provided ref code
                file: fs.createReadStream(imageFilePath) // the image file
                },
            }, function(error, response, body) {
                if(error) {
                console.error(error);
                reject(error);
                }
                var data = JSON.parse(body);
                console.log(data) // Receipt OCR result in JSON
                
                if(data.success){ 
                    console.log(data.receipts[0]) // Receipt OCR result in JSON
                    data = {
                        GST : data.receipts[0].merchant_tax_reg_no,
                        MobNo : data.receipts[0].merchant_phone,
                        MerchantName : data.receipts[0].merchant_name,
                        TotalBillAmount : data.receipts[0].total,
                        Website : data.receipts[0].merchant_website,
                        Country : data.receipts[0].country,
                        Date : data.receipts[0].date,
                        Time : data.receipts[0].time
                    }
                    data = JSON.stringify(data)
                    resolve(data)
                }else{ // OCR process API call limit for a hour is exceeded 
                
                    dialog.showMessageBox({
                        title: 'Bill Processing error',
                        message: 'Currently bills cannot be proccesed due to load. Please try again later or try entering the bills manually.',
                        type: 'warning',
                        buttons: ['OK']
                    })
                    reject(new Error('There was error in processing the invoice! Retry after some time.'))
                }
            });
            
        })
    }catch(err){
        console.log('Connection error: ' + err)
        dialog.showMessageBox({
            title: 'Network Connection Error',
            message: 'There is no internet connection. This feature requires an active internet connection.',
            type: 'warning',
            buttons: ['OK']
        })
        return new Promise( (resolve, reject) =>{
            reject(err)
        })
    }
} 

exports.verify_gst = async (gstNo) =>{
    console.log(`Reached main process`)

    const connectionCheckConfig = {
        timeout: 5000,
        retries: 3,
        domain: 'https://commonapi.mastersindia.co/commonapis'
    }
    
    try{
        await checkInternetConnected(connectionCheckConfig)
        
        const options = {
            method : 'GET',
            headers: {
                'Authorization': 'Bearer 0ab31ef7392227173c6e8d34195e86d5eb0da1e9',
                'client_id': 'JarZChUcsytSBbnkpt'  
            }
        }
        const response = await fetch(`https://commonapi.mastersindia.co/commonapis/searchgstin?gstin=${gstNo}`, options)

        var result = await response.json()
        
        console.log(result)
        if(!result.error && (result.data.dty === "Regular") && (result.data.sts === "Active")){
            return {status : 'active'}
        }else{
            return {status : 'deactive'}
        }

    }catch(err){
        console.log("No connection", err)
        dialog.showMessageBox({
            title: 'Network Connection Error',
            message: 'There is no internet connection. This feature requires an active internet connection.',
            type: 'warning',
            buttons: ['OK']
        })
        return new Promise( (resolve, reject) =>{
            reject(err)
        })
    }    
}

exports.open_file_dialog = async (event) =>{
    console.log(`Reached main process`)

    return new Promise( (resolve, reject) =>{

        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)

        // Open file selection dialog box
        dialog.showOpenDialog({
            win, // Attach the OS dialog the concerned window
            properties: ['openFile'], // Restrict only to file selection
            filters: [
                { name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] }, // Allow view and selection of these image formated only
            ]
        }).then( (result) =>{
            
            // Something selected
            if(!result.canceled){
                var filePath = result.filePaths[0]
                filePath = filePath.replaceAll('\\', '/')
                console.log(`Selected file path is :${filePath}`)
                resolve(filePath)
            }else{
                // Return empty file path
                resolve("")
            }
            
        }).catch( (error) =>{
            console.log(`Error is :${error}`)
            reject(error)
        })
        
    })
}
