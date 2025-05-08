const express = require("express");
const {   createExpensesInDetails,getExpensesInDetails } = require("../controllers/siteexpenses-controller");
const verifyToken  = require("../middleware/auth");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const siteExpensesRouter = express.Router();

siteExpensesRouter.post("/create/:urlKey" ,verifyToken,upload.single('expenses[attachment]'), createExpensesInDetails);
siteExpensesRouter.get("/:urlKey/:id" ,verifyToken, getExpensesInDetails);

siteExpensesRouter.get("/:fileId" ,verifyToken, getExpensesInDetails);
module.exports =  siteExpensesRouter;