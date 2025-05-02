const express = require("express");
const {   createSite,updateSite,siteList,siteDetails,expensesList,updateSiteExpenses } = require("../controllers/site-controller");
const verifyToken  = require("../middleware/auth");
const siteRouter = express.Router();

siteRouter.post("/create" ,verifyToken, createSite);
siteRouter.put("/update" ,verifyToken, updateSite);
siteRouter.put("/expenses" ,verifyToken,updateSiteExpenses);
siteRouter.get("/list" , verifyToken,siteList);
siteRouter.get("/:siteId" , verifyToken,siteDetails);
// siteRouter.get("/:siteId" , siteDetails);
siteRouter.get("/expenses/:siteId" ,verifyToken, expensesList);
module.exports =  siteRouter;