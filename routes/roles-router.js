const express = require("express");
const {   updateRoles,userList ,getRolesByEmail,deleteUser} = require("../controllers/roles-controller");
const verifyToken  = require("../middleware/auth");

const rolesRouter = express.Router();

rolesRouter.put("/:email",verifyToken, updateRoles);
rolesRouter.delete("/:email",verifyToken, deleteUser);
rolesRouter.get("/", verifyToken, userList);
rolesRouter.get("/:email", verifyToken, getRolesByEmail);
// teacherRouter.post("/login" , logIn);

module.exports =  rolesRouter;