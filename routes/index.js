 const teacherRouter = require("./routes/teacher-router");
const signUpRouter = require("./routes/signup-router");
const loginRouter = require("./routes/login-router"); 
// const verifyTokenRouter = require("./routes/index-router"); 
const logoutRouter = require('./routes/logout-router')

module.exports =  { teacherRouter, signUpRouter, loginRouter, classroomRouter, subjectRouter, timetableRouter};