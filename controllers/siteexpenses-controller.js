const {Site,ClientExpenses,Contractor,ContractorExpenses,ClientExpensesList} = require("../models/model");

const crypto = require("crypto");
const {  ObjectId } = require('mongodb');



const calculateTotal = (expenses)=>{
    let count = 0;
    for(let i =0; i<=expenses.length-1; i++){
        count += expenses[i].amount
    }
    // const val = expenses.reduce((prev,curr)=>{
    //       return prev+curr.amount;
    // },count);
    return count
};

 const createClientExpenses = async(file, site, site_id,bank_detail,amount, date, client_signature, engineer_signature,payment_mode) =>{
//    const expenses = {bank_detail,amount, date, client_signature, engineer_signature,payment_mode};
    console.log(file,'file')
    try{
        existenceExpenses = await ClientExpenses.findOne({site:ObjectId(site)},{site_id:1});
        // console.log(existenceExpenses,'existenceExpenses')
        // console.log(req.file,'req.file')
        const temp = {
            'bank_detail':bank_detail,
            'amount':amount,
            'date':date,
            'client_signature':client_signature,
            'engineer_signature':engineer_signature,
            'payment_mode':payment_mode,
            'attachment':null
        };
        if(file){
            temp.attachment = {
            data: file.buffer,
            contentType: file.mimetype,
            name:  file.originalname
            }
        };
        

        if(existenceExpenses){ 
            result = await ClientExpenses.findOneAndUpdate({site:ObjectId(site)}, {
                $push: {
                expenses :[{...temp}]
                // expenses: [{
                //     bank_detail, 
                //     amount, 
                //     date, 
                //     client_signature, 
                //     engineer_signature,
                //     payment_mode,
                //     attachment:{
                //         data: file.buffer,
                //         contentType: file.mimetype,
                //         name:  file.originalname
                //         },
                //     }],
                },
              });
              console.log(result.expenses,'result.expenses')
              const total  = calculateTotal(result.expenses);
              console.log(total,'total ClientExpenses')
              result = await Site.findOneAndUpdate({_id:ObjectId(site), site_id:site_id},{$set:{client_expenses:total}}, { new: true })
            //   console.log(total,'total')
            // result = await existenceExpenses.expenses.save(expenses);

            return result
        }
        else{
            // console.log(expenses,'expenses')
            const clientexpenses = new ClientExpenses({
                'site_id':site_id,
                'site':site, 
                'expenses' :[{...temp}]
            });
            result =  await clientexpenses.save();
            // console.log(result.expenses,'result.expenses')
            const total  = calculateTotal(result.expenses);
            result = await Site.findOneAndUpdate({_id:ObjectId(site), site_id:site_id},{$set:{client_expenses:total}}, { new: true })
            console.log(total,'total')
            if(result){
                return result
            }
            }
        
    }
    catch(err){
        console.log(err);
        return err
    }
}

const createExpensesInDetails = async(req,res,next) =>{
    const key = req.params.urlKey;
    const file = req.file
    console.log(key)
    // console.log(req.body,'req.body')
    if(key == 'client'){
        const { site, site_id, expenses:{bank_detail,amount, date, client_signature, engineer_signature,payment_mode}} = req.body;
        // const {bank_detail,amount, date, client_signature, engineer_signature,payment_mode }  = expenses;

        const result = createClientExpenses(file, site, site_id, bank_detail,amount, date, client_signature, engineer_signature,payment_mode );
         return res.status(200).send(result);
    }   
    else if (key == 'contractor'){

    }
    else{
        return res.status(403).json({ err:'err' })
    }
}

const getClientExpenses = async(req,res,next) =>{
    let clientExpenses;
    try{
        const site = req.params.site; 
        // console.log(site,'site')
        clientExpenses = await ClientExpenses.findOne({site:ObjectId(site)}).populate({path: 'site', select:'site_id site_name site_engineer_name site_engineer_email site_start_date site_type client_name client_email client_contact_no client_expenses_status attachment'});
        return res.status(200).send(clientExpenses);
    }
    catch(err){
        console.log(err);
        return res.status(403).json({ err })
    }
}

// const getSignatures= async(req,res,next) =>{
//     const doc = await ClientExpenses.findById(req.params.id);
//     const base64Data = doc.signature.replace(/^data:image\/\w+;base64,/, '');
//     const buffer = Buffer.from(base64Data, 'base64');
  
//     res.set('Content-Type', 'image/png');
//     res.send(buffer);
// }

module.exports = { createExpensesInDetails,getClientExpenses }


