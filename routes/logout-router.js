const express = require("express");
const { logOut } = require("../controllers/logout-controller");
const logoutRouter = express.Router();

logoutRouter.get("/", logOut);

module.exports = logoutRouter;
