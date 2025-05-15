const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // make sure this matches the secret used to sign
    req.email = decoded.email; // save user info to request object
    req.roles = decoded.roles;
    next();
  } catch (err) {
    logger.error(err);
    // next(err)
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
