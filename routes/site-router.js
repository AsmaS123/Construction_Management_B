const authorize = require("../middleware/authorize");

const express = require("express");
const {
  createSite,
  updateSite,
  siteList,
  siteDetails,
  expensesList,
  updateSiteExpenses,
} = require("../controllers/site-controller");

const verifyToken = require("../middleware/auth");

const siteRouter = express.Router();

siteRouter.post("/create", verifyToken, authorize(["admin"]), createSite);
siteRouter.put("/update", verifyToken, authorize(["admin"]), updateSite);
siteRouter.put(
  "/expenses",
  verifyToken,
  authorize(["admin"]),
  updateSiteExpenses,
);
siteRouter.get(
  "/list",
  verifyToken,
  authorize(["superuser", "admin"]),
  siteList,
);
siteRouter.get(
  "/:siteId",
  verifyToken,
  authorize(["superuser", "admin"]),
  siteDetails,
);
siteRouter.get(
  "/expenses/:siteId",
  verifyToken,
  authorize(["superuser", "admin"]),
  expensesList,
);

module.exports = siteRouter;

// siteRouter.post("/create", verifyToken, createSite);
// siteRouter.put("/update", verifyToken, updateSite);
// siteRouter.put("/expenses", verifyToken, updateSiteExpenses);
// siteRouter.get("/list", verifyToken, siteList);
// siteRouter.get("/:siteId", verifyToken, siteDetails);
// siteRouter.get("/expenses/:siteId", verifyToken,expensesList);
