const express = require("express");
const {   signUp  } = require("../controllers/signup-controller");
const signUpRouter = express.Router();


// teacherRouter.get("/",signUp);
signUpRouter.post("/", signUp);

// teacherRouter.post("/login" , logIn);

module.exports =  signUpRouter;