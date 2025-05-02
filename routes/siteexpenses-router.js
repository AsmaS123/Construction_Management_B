const express = require("express");
const {   createExpensesInDetails,getClientExpenses } = require("../controllers/siteexpenses-controller");
const verifyToken  = require("../middleware/auth");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const siteExpensesRouter = express.Router();

siteExpensesRouter.post("/create/:urlKey" ,verifyToken,upload.single('expenses[attachment]'), createExpensesInDetails);
siteExpensesRouter.get("/:site" ,verifyToken, getClientExpenses);
module.exports =  siteExpensesRouter;