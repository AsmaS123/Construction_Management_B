const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContractorSchema = new mongoose.Schema({
  contractor_type: { type: String, required: true },
  contractor_name: { type: String, required: true},
  contractor_contact_no: { type: String, required: true },
  contractor_email: { type: String, required: true },
  contractor_expenses: { type: Number },
  contractor_expenses_status: { type: String },
  contractor_expenses_date: { type: String },
  contractorexpenses:{
    type: Schema.Types.ObjectId,
    ref: 'ContractorExpenses'
  }
  // site: { type: mongoose.Schema.Types.ObjectId, ref: "Site" }, // Reference to Parent
});

const ClientExpensesListSchema = new mongoose.Schema({
  // check_no: { type: String },
  bank_detail:{ type: String },
  amount:{ type: Number,required: true},
  date: { type: String,required: true },
  client_signature :  { type: String },
  engineer_signature:{ type: String },
  attachment: { 
    data: Buffer,
    contentType: String,
    name:String
   },
  payment_mode:{ type: String,required: true},
})

const ClientExpensesSchema = new mongoose.Schema({
  site_id : { type: String, required: true },
  site: {
    type: Schema.Types.ObjectId,
    ref: 'Site'
  },
  expenses:[ClientExpensesListSchema]
})

const ContractorExpensesListSchema = new mongoose.Schema({
  check_no: { type: String },
  bank_detail:{ type: String },
  amount:{ type: Number},
  date: { type: String },
  payment_mode:{ type: String },
  contractor_signature :  { type: String },
  engineer_signature:{ type: String },
  attachment: { type: String },
})

const ContractorExpensesSchema = new mongoose.Schema({
  site_id : { type: String, required: true },
  contractor: {
    type: Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  expenses:[ContractorExpensesListSchema]
})



const SiteSchema = new mongoose.Schema({
    site_id : { type: String, required: true },
    site_type : { type: String, required: true },
    site_name : { type: String, required: true },
    site_engineer_name : { type: String, required: true },
    site_engineer_email : { type: String, required: true },
    client_name:{ type: String, required: true },
    client_email:{ type: String, required: true },
    client_contact_no:{ type: String, required: true },
    client_expenses: { type: Number },
    client_expenses_status: { type: String },
    client_expenses_date: { type: String },
    clientexpenses: {
      type: Schema.Types.ObjectId,
      ref: 'ClientExpenses'
    },
    site_address : { type: String, required: true },
    site_start_date : { type: String, required: true },
    site_end_date : { type: String },
    // contractor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contractor" }], // References Child Model
    contractor : [ContractorSchema]
  });

  
const Site =  mongoose.model("Site", SiteSchema);
const Contractor = mongoose.model("Contractor", ContractorSchema);
const ClientExpenses = mongoose.model("ClientExpenses", ClientExpensesSchema);
const ContractorExpenses = mongoose.model("ContractorExpenses", ContractorExpensesSchema);
const ClientExpensesList = mongoose.model("ClientExpensesList", ClientExpensesListSchema);
// const SiteExpenses = mongoose.model("SiteExpenses", SiteExpenseSchema);


// const Contractor =  mongoose.model("Contractor", ContractorSchema);


module.exports = {Site,ClientExpenses,Contractor,ContractorExpenses,ClientExpensesList }





// const SiteClientExpensesSchemma  = new mongoose.Schema({
  //   site_id : { type: String, required: true },
    
  // })

  // const SiteContractorExpensesSchemma  = new mongoose.Schema({
  //   site_id : { type: String, required: true },
  // })


  // const SiteExpenseSchema = new mongoose.Schema({
  //   site_id : { type: String, required: true },
  //   clientexpenses : {SiteClientExpensesSchemma},
  //   contractorexpenses : [SiteContractorExpensesSchemma]
  // });




// const ParentSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }], // References Child Model
//   });

//   const ChildSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     age: { type: Number, required: true },
//     parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" }, // Reference to Parent
//   });