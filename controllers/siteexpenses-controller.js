const {
  Site,
  ClientExpenses,
  Contractor,
  ContractorExpenses,
  ClientExpensesList,
} = require("../models/model");

const crypto = require("crypto");
const { ObjectId } = require("mongodb");

const calculateTotal = (expenses) => {
  let count = 0;
  for (let i = 0; i <= expenses.length - 1; i++) {
    count += expenses[i].amount;
  }
  return count;
};

const createContractorExpenses = async (
  file,
  contractor,
  site_id,
  bank_detail,
  amount,
  date,
  contractor_signature,
  engineer_signature,
  payment_mode,
) => {
  try {
    existenceExpenses = await ContractorExpenses.findOne(
      { contractor: ObjectId(contractor) },
      { site_id: 1 },
    );
    const temp = {
      bank_detail: bank_detail,
      amount: amount,
      date: date,
      contractor_signature: contractor_signature,
      engineer_signature: engineer_signature,
      payment_mode: payment_mode,
      attachment: null,
    };
    if (file) {
      temp.attachment = {
        data: file.buffer,
        contentType: file.mimetype,
        name: file.originalname,
      };
    }
    if (existenceExpenses) {
      result = await ContractorExpenses.findOneAndUpdate(
        { contractor: ObjectId(contractor) },
        {
          $push: {
            expenses: [{ ...temp }],
          },
        },
      );
      const total = calculateTotal(result.expenses);
      const result = await Site.updateOne(
        { site_id: site_id },
        {
          $set: {
            "contractor.$[elem].contractor_expenses": total,
          },
        },
        {
          arrayFilters: [{ "elem._id": contractor }],
        },
      );
      return result;
    } else {
      const contractorExpenses = new ContractorExpenses({
        site_id: site_id,
        contractor: contractor,
        expenses: [{ ...temp }],
      });
      result = await contractorExpenses.save();
      const total = calculateTotal(result.expenses);

      const result = await Site.updateOne(
        { site_id: site_id },
        {
          $set: {
            "contractor.$[elem].contractor_expenses": total,
          },
        },
        {
          arrayFilters: [{ "elem._id": contractor }],
        },
      );
      if (result) {
        return result;
      }
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
const createClientExpenses = async (
  file,
  site,
  site_id,
  bank_detail,
  amount,
  date,
  client_signature,
  engineer_signature,
  payment_mode,
) => {
  try {
    existenceExpenses = await ClientExpenses.findOne(
      { site: ObjectId(site) },
      { site_id: 1 },
    );
    const temp = {
      bank_detail: bank_detail,
      amount: amount,
      date: date,
      client_signature: client_signature,
      engineer_signature: engineer_signature,
      payment_mode: payment_mode,
      attachment: null,
    };
    if (file) {
      temp.attachment = {
        data: file.buffer,
        contentType: file.mimetype,
        name: file.originalname,
      };
    }
    if (existenceExpenses) {
      result = await ClientExpenses.findOneAndUpdate(
        { site: ObjectId(site) },
        {
          $push: {
            expenses: [{ ...temp }],
          },
        },
      );
      // console.log(result.expenses, "result.expenses");
      const total = calculateTotal(result.expenses);
      // console.log(total, "total ClientExpenses");
      result = await Site.findOneAndUpdate(
        { _id: ObjectId(site), site_id: site_id },
        { $set: { client_expenses: total } },
        { new: true },
      );
      return result;
    } else {
      const clientexpenses = new ClientExpenses({
        site_id: site_id,
        site: site,
        expenses: [{ ...temp }],
      });
      result = await clientexpenses.save();
      const total = calculateTotal(result.expenses);
      result = await Site.findOneAndUpdate(
        { _id: ObjectId(site), site_id: site_id },
        { $set: { client_expenses: total } },
        { new: true },
      );
      if (result) {
        return result;
      }
    }
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const createExpensesInDetails = async (req, res, next) => {
  const key = req.params.urlKey;
  const file = req.file;
  if (key == "client") {
    const {
      site,
      site_id,
      expenses: {
        bank_detail,
        amount,
        date,
        client_signature,
        engineer_signature,
        payment_mode,
      },
    } = req.body;

    const result = createClientExpenses(
      file,
      site,
      site_id,
      bank_detail,
      amount,
      date,
      client_signature,
      engineer_signature,
      payment_mode,
    );
    return res.status(200).send(result);
  } else if (key == "contractor") {
    const {
      contractor,
      site_id,
      expenses: {
        bank_detail,
        amount,
        date,
        contractor_signature,
        engineer_signature,
        payment_mode,
      },
    } = req.body;
    const result = createContractorExpenses(
      file,
      contractor,
      site_id,
      bank_detail,
      amount,
      date,
      contractor_signature,
      engineer_signature,
      payment_mode,
    );
    return res.status(200).send(result);
  } else {
    return res.status(403).json({ err: "err" });
  }
};

const getExpensesInDetails = async (req, res, next) => {
  let clientExpenses;
  let contractorExpenses;
  try {
    const urlKey = req.params.urlKey;
    const id = req.params.id;
    if (urlKey == "client") {
      clientExpenses = await ClientExpenses.findOne({
        site: ObjectId(id),
      }).populate({
        path: "site",
        select:
          "site_id site_name site_engineer_name site_engineer_email site_start_date site_type client_name client_email client_contact_no client_expenses_status attachment",
      });
      return res.status(200).send(clientExpenses);
    } else if (urlKey == "contractor") {
      contractorExpenses = await ContractorExpenses.findOne({
        contractor: ObjectId(id),
      });
      if (contractorExpenses && contractorExpenses.site_id) {
        const temp = await ContractorExpenses.findOne({
          contractor: ObjectId(id),
        });
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
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

const getAttachment = async (req, res, next) => {
  const urlKey = req.params.urlKey;
  const siteId = req.params.siteId;
  const expensesId = req.params.expensesId;
  if (urlKey == "client") {
    const doc = await ClientExpenses.findOne(
      { site_id: siteId },
      { expenses: 1, _id: 0 },
    );
    if (!doc) {
      res.send("Site not found");
    }
    const expense = doc.expenses.filter((exp) => {
      if (exp._id == expensesId) {
        return exp;
      }
    });
    if (!expense) {
      res.send("Expense not found");
    }
    res.contentType(expense[0].attachment.contentType);
    const base64String = Buffer.from(
      expense[0].attachment.data.buffer,
    ).toString("base64");
    return res.status(200).json({
      data: base64String,
      contentType: expense[0].attachment.contentType,
      fileName: expense[0].attachment.name,
    });
  }
};

module.exports = {
  createExpensesInDetails,
  getExpensesInDetails,
  getAttachment,
};
