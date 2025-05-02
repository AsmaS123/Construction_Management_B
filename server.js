// const teacherRouter = require("./routes/teacher-router");
const cookieParser = require('cookie-parser');

const signUpRouter = require("./routes/signup-router");
const loginRouter = require("./routes/login-router"); 
// const verifyTokenRouter = require("./routes/index-router"); 
const rolesRouter = require("./routes/roles-router");
const siteRouter = require("./routes/site-router");
const siteExpensesRouter = require("./routes/siteexpenses-router");
const logoutRouter = require("./routes/logout-router")
const authenticate= require("./middleware/authenticate ");
const logger = require("./middleware/loger");
const jwt = require("jsonwebtoken");
const verifyToken  = require("./middleware/auth")
// require('dotenv').config()
//entry point of application
const express = require('express');

require("./config/db");
var http = require('http');
const cors = require("cors");
// var corsOptions = {
//   origin: "http://localhost:8081"
// };

const app = express();
app.use(cookieParser());
// app.use(cors(corsOptions));
// app.use(cors());
app.use(cors(
  {origin: ['http://localhost:3000'],
  methods: ['GET', 'POST','PUT','DELETE'],
  credentials:true,
}
))

// app.use(cors({ origin: ["http://localhost:3000", "http://18.234.61.160:3000"] }));

app.set("view engine", "ejs");
app.use(express.json());
app.use("/api/site", siteRouter);
app.use("/api/siteexpenses", siteExpensesRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/signUp", signUpRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
// app.use("/api/index", verifyTokenRouter)

app.listen(5003, () => {
  logger.log("info", `App listening on port 5003!`);
});

app.get('/profile', verifyToken,(req, res) => {

  const email = req.email;
  res.json({ email: req.email});
  // const token = req.cookies.token;
  // console.log(token,'token')
  // if (!token) return res.status(401).json({ message: 'No token' });

  // try {
  //   const data = jwt.verify(token, process.env.SECRET_KEY);
  //   res.json({ message: 'Welcome back!', user: data });
  // } catch {
  //   res.status(403).json({ message: 'Invalid token' });
  // }
});








// app.get('/protected', authenticate, (req, res) => {
//   if(req.routestatus == 'valid'){
//     res.json({ message: req.message ,email:req.email, status: req.routestatus, password:req.password});
//   }
//   else{
//     res.json({ message: req.message});
//   }
// });



// app.use("/api/teachers",[authenticate], teacherRouter);
// app.use("/api/classroom",classroomRouter)
// app.use("/api/subject",subjectRouter)
// app.use("/api/exam",examRouter)
// app.use("/api/timetable", timetableRouter)
// app.use("/api/student", studentRouter)
// app.use("/api/attendance", attendanceRouter)



// const resultRouter = require("./routes/result-router");
// const examRouter  = require("./routes/exam-router");

// const classroomRouter = require("./routes/classroom-router");
// const subjectRouter = require("./routes/subject-router");
// const timetableRouter = require("./routes/timetable-router");
// const studentRouter = require("./routes/student-router");
// const attendanceRouter = require("./routes/attendance-router");