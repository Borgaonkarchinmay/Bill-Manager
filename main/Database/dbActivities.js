const db = require('./dbInit')

exports.save_essential_invoice_fields = (invoice) =>{
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
}

exports.save_all_invoice_fields = (invoice) =>{
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
}

exports.fetch_all_invoices = () =>{
    console.log('main btn fetch')

    return new Promise((resolve, reject) =>{
        const querry = 'SELECT merchant_name, invoice_date_time, merchant_pan, merchant_gst, merchant_mob_no, total_amount, website, country, payment_method, payment_status FROM invoices'
        
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
}

exports.delete_a_invoice = (invoice_id) =>{
    console.log('main btn delete')

    return new Promise((resolve, reject) =>{
        const querry = 'delete from invoices where invoice_id = ?'
        
        db.query(querry, [invoice_id], (err, res) =>{
            if(err){
                console.log(`Oops error! ${err}`)
                reject(err)
            }else{
                var rows = JSON.parse(JSON.stringify(res))
                resolve(rows)
            }
        })
    })
}