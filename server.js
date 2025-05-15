const cookieParser = require("cookie-parser");
const signUpRouter = require("./routes/signup-router");
const loginRouter = require("./routes/login-router");
const rolesRouter = require("./routes/roles-router");
const siteRouter = require("./routes/site-router");
const siteExpensesRouter = require("./routes/siteexpenses-router");
const logoutRouter = require("./routes/logout-router");
// const authenticate = require("./middleware/authenticate ");
const logger = require("./middleware/loger");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const express = require("express");

require("./config/db");

var http = require("http");
const cors = require("cors");

const app = express();
app.use(cookieParser());

var corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

// app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.set("view engine", "ejs");
app.use(express.json());
app.use("/api/site", siteRouter);
app.use("/api/siteexpenses", siteExpensesRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/signUp", signUpRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
// app.use("/api/index", verifyTokenRouter)

app.get("/error_test", (req, res, next) => {
  const error = new Error("failing");
  // throw error;
  error.statusCode = 400;
  next(error);
});

app.use(errorHandler);

app.listen(5003, () => {
  logger.info(`App listening on port 5003!`);
});

// app.get("/profile", verifyToken, (req, res) => {
//   const email = req.email;
//   res.json({ email: req.email });
// });
