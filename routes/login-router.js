const express = require("express");
const {   logIn,  } = require("../controllers/login-controller");
const loginRouter = express.Router();


// teacherRouter.get("/",signUp);
loginRouter.post("/", logIn);
// loginRouter.post("/token", generateToken);
// loginRouter.post("/validatetoken", validateToken);
// teacherRouter.post("/login" , logIn);

module.exports =  loginRouter;