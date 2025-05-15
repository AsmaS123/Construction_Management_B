const {
  Site,
  ClientExpenses,
  Contractor,
  ContractorExpenses,
} = require("../models/model");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const logger = require("../middleware/loger");

const createSite = async (req, res, next) => {
  const {
    site_type,
    site_name,
    site_engineer_name,
    site_engineer_email,
    client_name,
    client_email,
    client_contact_no,
    client_expenses,
    client_expenses_status,
    client_expenses_date,
    site_address,
    site_start_date,
    site_end_date,
    contractor,
  } = req.body;
  let existingSite;
  let result;
  try {
    let randomFourDigit = crypto.randomInt(1000, 10000);
    let site_id = "ST" + randomFourDigit + "";
    // console.log(contractor)
    existingSite = await Site.findOne({ site_name: site_name });
    if (existingSite) {
      return res.status(400).json({ message: "this record already exists!" });
    } else {
      const site = new Site({
        site_id,
        site_type,
        site_name,
        site_engineer_name,
        site_engineer_email,
        client_name,
        client_email,
        client_contact_no,
        client_expenses,
        client_expenses_status,
        site_address,
        site_start_date,
        site_end_date,
        contractor,
      });
      result = await site.save();
      if (result && result.contractor) {
        return res.status(201).json({ result });
      }
      // if(result && result.contractor){
      //     console.log(result,'result')
      //     if(result.contractor.length>0){
      //         result.contractor.forEach(async (elm,i)=>{
      //             console.log(elm,'elm')
      //             const contractor_expenses = new ContractorExpenses({
      //                 site_id : result.site_id,
      //                 contractor : elm._id,
      //                 expenses:[]
      //             });
      //             const resultcontractor_exp =  await contractor_expenses.save();
      //             console.log(resultcontractor_exp,'resultcontractor_exp')
      //             if(resultcontractor_exp){
      //                 site.contractor[i].contractorexpenses = resultcontractor_exp._id;

      //             }

      //         })
      //         result =  await site.save();
      //     }
      //     const client_expenses = new ClientExpenses({
      //         site_id : result.site_id,
      //         site : result._id,
      //         expenses:[]

      //     });
      //     const resultclient =  await client_expenses.save();
      //     if(resultclient){
      //         site.client = resultclient._id;
      //        result =  await site.save();
      //     }
      //     return res.status(201).json({ result })
      // }
    }
    return res.status(200).json({ message: "Site is created" });
  } catch (err) {
    logger.error(err);
    // return res.status(403).json({ message: "invalid!" });
    next(err);
  }
};

const updateSite = async (req, res, next) => {
  const { _id, ...rest } = req.body;
  const objectId = new ObjectId(_id);
  try {
    const result = await Site.updateOne(
      { _id: objectId },
      { $set: { ...rest } },
    );
    return res.status(200).json({ result });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const updateSiteExpenses = async (req, res, next) => {
  const {
    _id,
    site_id,
    client_expenses,
    client_expenses_status,
    client_expenses_date,
    contractor,
  } = req.body;
  // console.log(req.body,'req.body')
  const objectId = new ObjectId(_id); // Convert to ObjectId

  try {
    const result = await Site.updateOne(
      { _id: objectId },
      {
        $set: {
          client_expenses: client_expenses,
          client_expenses_status: client_expenses_status,
          client_expenses_date: client_expenses_date,
          contractor: contractor,
        },
      },
    );
    return res.status(200).json({ result });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const siteList = async (req, res, next) => {
  let roles = req.roles;
  // console.log(roles,'roles')
  let siteList;
  try {
    siteList = await Site.find(
      {},
      {
        site_id: 1,
        site_type: 1,
        site_name: 1,
        site_engineer_name: 1,
        site_engineer_email: 1,
        site_address: 1,
        site_start_date: 1,
        _id: 0,
      },
    );
    return res.status(200).json({ siteList });
  } catch (err) {
    // console.log(err);
    logger.log(err);
    // return res.status(403).json({ err });
    next(err);
  }
};

const siteDetails = async (req, res, next) => {
  let siteDetail;
  const siteid = req.params.siteId; // Extract route param
  // console.log(`Site ID: ${siteid}`)
  try {
    siteDetail = await Site.findOne({ site_id: siteid });
    // console.log(siteDetail,'siteDetail')
    return res.status(200).send(siteDetail);
  } catch (err) {
    // console.log(err);
    logger.log(err);
    next(err);
    // return res.status(403).json({ err });
  }
};

const expensesList = async (req, res, next) => {
  let expensesDetail;
  const siteid = req.params.siteId; // Extract route param
  // console.log(`Site ID: ${siteid}`);
  try {
    // expensesDetail = await Site.findOne({site_id:siteid}, {client_name:1, client_expenses:1, client_expenses_status:1});
    expensesDetail = await Site.findOne(
      { site_id: siteid },
      {
        site_id: 1,
        site_type: 1,
        site_name: 1,
        site_engineer_name: 1,
        client_name: 1,
        client_expenses: 1,
        client_expenses_status: 1,
        client_expenses_date: 1,
        contractor: 1,
      },
    );
    // console.log(expensesDetail,'expensesDetail')
    return res.status(200).send(expensesDetail);
  } catch (err) {
    // console.log(err);
    logger.log(err);
    // return res.status(403).json({ err });
    next(err);
  }
};

module.exports = {
  createSite,
  updateSite,
  siteList,
  siteDetails,
  expensesList,
  updateSiteExpenses,
};
