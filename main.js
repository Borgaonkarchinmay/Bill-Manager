const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const mysql = require('mysql')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const request = require('request');
const fs = require('fs');
const checkInternetConnected = require('check-internet-connected');



const db = mysql.createConnection({
    user : "root",
    host : "localhost",
    password : "Chinmaypb@1032",
    database : "invoicedb",
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
}

// Call createWindow() function when app is ready
// Special .whenReady helper function by electron to assure readyness of the app
app.whenReady().then( () =>{

    // Listen to stuFormData channel for stu-form save event 
    ipcMain.handle('invoice_essential_fields:save', (event, invoice) =>{
        console.log('save all essential invoice data fields')
        return new Promise((resolve, reject) =>{
            const merchant_name = invoice.merchant_name
            const merchant_pan = invoice.merchant_pan
            const merchant_gst = invoice.merchant_gst
            const merchant_mob_no = invoice.merchant_mob_no
            const total_amount = invoice.total_amount
            
            const querry = 'insert into invoices(merchant_name, merchant_pan, merchant_gst, merchant_mob_no, total_amount) values(?, ?, ?, ?, ?)'

            db.query(querry, [merchant_name, merchant_pan, merchant_gst, merchant_mob_no, total_amount], (err, result) =>{
                if(err){
                    console.log(`Oops error! ${err}`)
                    reject(err)
                }
                else{
                    console.log(result)
                    resolve(result)
                }
            })
        })
    })

    // Listen to stuFormData channel for stu-form save event 
    ipcMain.handle('invoice_all_fields:save', (event, invoice) =>{
        
        return new Promise((resolve, reject) =>{
            const merchant_name = invoice.merchant_name
            const invoice_date_time = invoice.invoice_date_time
            const merchant_pan = invoice.merchant_pan
            const merchant_gst = invoice.merchant_gst
            const merchant_mob_no = invoice.merchant_mob_no
            const total_amount = invoice.total_amount
            const website = invoice.website
            const country = invoice.country
            const payment_method = invoice.payment_method
            const payment_status = invoice.payment_status
            
            const querry = 'insert into invoices(merchant_name, invoice_date_time, merchant_pan, merchant_gst, merchant_mob_no, total_amount, website, country, payment_method, payment_status) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

            db.query(querry, [merchant_name, invoice_date_time, merchant_pan, merchant_gst, merchant_mob_no, total_amount, website, country, payment_method, payment_status], (err, result) =>{
                if(err){
                    console.log(`Oops error! ${err}`)
                    reject(err)
                }
                else{
                    console.log(result)
                    resolve(result)
                }
            })
        })
    })

    
    ipcMain.handle('invoice:fetch', (event) =>{
        console.log('main btn fetch')

        return new Promise((resolve, reject) =>{
            const querry = 'SELECT * FROM invoices'
            
            db.query(querry, (err, res) =>{
                if(err){
                    console.log(`Oops error! ${err}`)
                    reject(err)
                }else{
                    var rows = JSON.parse(JSON.stringify(res))
                    console.log(rows)
                    resolve(rows)
                }
            })
        })
    })

    ipcMain.handle('invoice:delete', (event, invoice_id) =>{
        console.log('main btn delete')

        return new Promise((resolve, reject) =>{
            const querry = 'delete from invoices where invoice_id = ?'
            
            db.query(querry, [invoice_id], (err, res) =>{
                if(err){
                    console.log(`Oops error! ${err}`)
                    reject(err)
                }else{
                    var rows = JSON.parse(JSON.stringify(res))
                    console.log(rows)
                    resolve(rows)
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

    })

    ipcMain.handle('fill-bill:executeOCR', (event, imageFilePath) =>{
        const receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt'; 
        
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
                
                if(data.success === 'true'){ 
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
                    reject(new Error('There was error in processing the invoice! Retry after some time.'))
                }
            });
            
        })
    })

    ipcMain.handle('bill-gst:verify', async (event, gstNo) =>{

        console.log(`Reached main process`)

        const connectionCheckConfig = {
            timeout: 5000,
            retries: 3,
            domain: 'https://commonapi.mastersindia.co/commonapis'
        }
        
        try{
            await checkInternetConnected(connectionCheckConfig);
            
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
            return err
        }    
    })

    createWindow()    
})

// Close the app when all the windows are closed
app.on('window-all-closed', () =>{
    if(process.platform != 'darwin')
        app.quit() // Allowed iff OS : Windows | Linux
})