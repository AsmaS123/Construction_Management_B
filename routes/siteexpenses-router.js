const express = require("express");
const authorize = require("../middleware/authorize");
const {
  createExpensesInDetails,
  getExpensesInDetails,
  getAttachment,
} = require("../controllers/siteexpenses-controller");
const verifyToken = require("../middleware/auth");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const siteExpensesRouter = express.Router();

siteExpensesRouter.post(
  "/create/:urlKey",
  verifyToken,
  authorize(["admin"]),
  upload.single("expenses[attachment]"),
  createExpensesInDetails,
);
siteExpensesRouter.get("/:urlKey/:id", verifyToken, getExpensesInDetails);

siteExpensesRouter.get(
  "/attachment/:siteId/:urlKey/:expensesId",
  verifyToken,
  authorize(["admin", "superuser"]),
  getAttachment,
);
module.exports = siteExpensesRouter;
