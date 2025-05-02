const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token,'token')
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // make sure this matches the secret used to sign
    // console.log(decoded,'decoded')
    req.email = decoded.email; // save user info to request object
    req.roles = decoded.roles
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;