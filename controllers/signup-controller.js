const User = require("../models/User");
const bcrypt = require("bcryptjs");
const logger = require("../middleware/loger");
const signUp = async (req, res, next) => {
  const { name, email, password, roles } = req.body;
  // console.log(req.body,'req.body')
  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    logger.error(err);
    next(err);
  }

  if (existingUser) {
    return res.status(400).json({ message: "User is already exists!" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    status: "pending",
    roles: roles,
  });
  try {
    user.save();
    return res.status(201).json({ user });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

module.exports = { signUp };
