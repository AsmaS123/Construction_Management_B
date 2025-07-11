const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../middleware/loger");

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  let token;
  let psw = password;
  try {
    existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User is not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password!" });
    }
    if (existingUser && existingUser.email) {
      token = await tokenGenerate(existingUser.email, existingUser.roles);
      res.cookie("token", token, {
        // httpOnly: true,
        // secure: true, // change to true in production (with HTTPS)
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
    }
    return res.status(200).json({
      name: existingUser.name,
      email: existingUser.email,
      token: token,
      roles: existingUser.roles,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

async function tokenGenerate(email, roles) {
  const token = jwt.sign(
    { email: email, roles: roles },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
  );
  return token;
}

const refreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  // req.email = decoded.email; // save user info to request object
  // req.roles = decoded.roles;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token

    const newAccessToken = tokenGenerate({
      email: user.email,
      roles: user.roles,
    });
    res.json({ accessToken: newAccessToken });
  });
};

module.exports = { logIn, refreshToken };
