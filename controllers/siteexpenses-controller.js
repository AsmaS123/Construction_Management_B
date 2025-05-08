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

const createContractorExpenses = async(file, contractor, site_id,bank_detail,amount, date, contractor_signature, engineer_signature,payment_mode) =>{
    console.log(file,'file');
    try{
        existenceExpenses = await ContractorExpenses.findOne({contractor:ObjectId(contractor)},{site_id:1});
        const temp = {
            'bank_detail':bank_detail,
            'amount':amount,
            'date':date,
            'contractor_signature':contractor_signature,
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
            result = await ContractorExpenses.findOneAndUpdate({contractor:ObjectId(contractor)}, {
                $push: {
                expenses :[{...temp}]
                },
              });
              console.log(result.expenses,'result.expenses')
              const total  = calculateTotal(result.expenses);
              console.log(total,'total ClientExpenses');
              const result=  await Site.updateOne(
                { site_id: site_id },
                {
                  $set: {
                    'contractor.$[elem].contractor_expenses': total
                  }
                },
                {
                  arrayFilters: [{ 'elem._id': contractor }]
                }
              );
            //   result = await Site.findOneAndUpdate({_id:ObjectId(contractor), site_id:site_id},{$set:{client_expenses:total}}, { new: true })
            return result
        }
        else{
            const contractorExpenses = new ContractorExpenses({
                'site_id':site_id,
                'contractor':contractor, 
                'expenses' :[{...temp}]
            });
            result =  await contractorExpenses.save();
            const total  = calculateTotal(result.expenses);

            const result=  await Site.updateOne(
                { site_id: site_id },
                {
                  $set: {
                    'contractor.$[elem].contractor_expenses': total
                  }
                },
                {
                  arrayFilters: [{ 'elem._id': contractor }]
                }
              );

            // result = await Site.findOneAndUpdate({_id:ObjectId(site), site_id:site_id},{$set:{client_expenses:total}}, { new: true })
            console.log(total,'total')
            if(result){
                return result
            }
        }
    }
    catch{

    }
}
 const createClientExpenses = async(file, site, site_id,bank_detail,amount, date, client_signature, engineer_signature,payment_mode) =>{
    console.log(file,'file')
    try{
        existenceExpenses = await ClientExpenses.findOne({site:ObjectId(site)},{site_id:1});
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
                },
              });
              console.log(result.expenses,'result.expenses')
              const total  = calculateTotal(result.expenses);
              console.log(total,'total ClientExpenses')
              result = await Site.findOneAndUpdate({_id:ObjectId(site), site_id:site_id},{$set:{client_expenses:total}}, { new: true })
            return result
        }
        else{
            const clientexpenses = new ClientExpenses({
                'site_id':site_id,
                'site':site, 
                'expenses' :[{...temp}]
            });
            result =  await clientexpenses.save();
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
        const { contractor, site_id, expenses:{bank_detail,amount, date, contractor_signature, engineer_signature,payment_mode}} = req.body;
        const result = createContractorExpenses(file, contractor, site_id, bank_detail,amount, date, contractor_signature, engineer_signature,payment_mode );
        return res.status(200).send(result);
    }
    else{
        return res.status(403).json({ err:'err' })
    }
}

const getExpensesInDetails = async(req,res,next) =>{
    let clientExpenses;
    let contractorExpenses;
    try{
        const urlKey = req.params.urlKey; 
        const id = req.params.id; 
        // console.log(site,'site')
        if(urlKey == 'client'){
            clientExpenses = await ClientExpenses.findOne({site:ObjectId(id)}).populate({path: 'site', select:'site_id site_name site_engineer_name site_engineer_email site_start_date site_type client_name client_email client_contact_no client_expenses_status attachment'});
            return res.status(200).send(clientExpenses);
        }
        else if(urlKey == 'contractor'){
            contractorExpenses = await ContractorExpenses.findOne({contractor:ObjectId(id)});
            if(contractorExpenses && contractorExpenses.site_id){
                const temp = await ContractorExpenses.findOne({contractor:ObjectId(id)})
                // const temp =  await Site.aggregate([
                //     {
                //       $lookup: {
                //         from: "contractorexpenses",
                //         let: { siteId: contractorExpenses.site_id },
                //         pipeline: [
                //           {
                //             $match: {
                //               $expr: {
                //                 $eq: ["$site_id", contractorExpenses.site_id]
                //               }
                //             }
                //           },
                //           {
                //             $project: {
                //               _id: 0,
                //               contractor_name: 1,
                //               contractor_expenses_status: 1
                //             }
                //           }
                //         ],
                //         as: "matched_contractors"
                //       }
                //     },
                //     {
                //       $project: {
                //         _id: 0,
                //         site_id: 1,
                //         site_name: 1,
                //         matched_contractors: 1
                //       }
                //     }
                //   ]);
                  return res.status(200).send(temp);
            }
            
        }
    }
    catch(err){
        console.log(err);
        return res.status(403).json({ err })
    }
}


const getFile = async(req,res,next) =>{

}
// const getSignatures= async(req,res,next) =>{
//     const doc = await ClientExpenses.findById(req.params.id);
//     const base64Data = doc.signature.replace(/^data:image\/\w+;base64,/, '');
//     const buffer = Buffer.from(base64Data, 'base64');
  
//     res.set('Content-Type', 'image/png');
//     res.send(buffer);
// }

module.exports = { createExpensesInDetails,getExpensesInDetails }


