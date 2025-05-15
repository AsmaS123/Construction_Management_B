// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");
const { tokenVerify } = require("../controllers/login-controller");

const authenticate = async (err, req, res, next) => {
  const authHeader = req.header("Authorization");
  //   const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract the token part
    token = authHeader.slice(7); // Remove 'Bearer ' prefix
    // req.token = token; // Attach the token to the request object
    const decode = await tokenVerify(token);
    if (decode.email && decode.password) {
      // console.log(decode,'decode')
      req.email = decode.email;
      req.password = decode.password;
      req.routestatus = "valid";
      req.message = "Authorization token is valid";
      next();
    } else {
      return res
        .status(401)
        .json({ message: "Authorization token is invalid." });
    }
  } else {
    token = null;
    req.routestatus = "invalid";
    req.message = "Authorization token is invalid";
    // next()
    return res.status(401).json({ message: "Authorization token is invalid." });
    // req.token = null; // No token found
  }
  if (!token) {
    req.routestatus = "invalid";
    req.message = "Authorization token is required";
    //  next()
    return res
      .status(401)
      .json({ message: "Authorization token is required." });
  }
};

module.exports = authenticate;
