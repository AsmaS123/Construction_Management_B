const express = require("express");
const authorize = require("../middleware/authorize");
const {
  updateRoles,
  userList,
  getRolesByEmail,
  deleteUser,
} = require("../controllers/roles-controller");
const verifyToken = require("../middleware/auth");

const rolesRouter = express.Router();

rolesRouter.put("/:email", verifyToken, authorize(["admin"]), updateRoles);
rolesRouter.delete("/:email", verifyToken, authorize(["admin"]), deleteUser);
rolesRouter.get("/", verifyToken, authorize(["superuser", "admin"]), userList);
rolesRouter.get("/:email", verifyToken, authorize(["admin"]), getRolesByEmail);
// teacherRouter.post("/login" , logIn);

module.exports = rolesRouter;
