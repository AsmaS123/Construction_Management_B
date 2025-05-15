const User = require("../models/User");
const bcrypt = require("bcryptjs");
const logger = require("../middleware/loger");
const updateRoles = async (req, res, next) => {
  const { email } = req.params;
  const updatedData = req.body;

  try {
    const result = await User.findOneAndUpdate({ email: email }, updatedData);
    if (result) {
      return res.status(200).json({ message: "Role is updated" });
    }
    // else {
    //   return res.status(403).json({ message: "Role not updated" });
    // }
  } catch (err) {
    logger.error(err);
    next(err);
    // return res.status(403).json({ message: "invalid!" });
  }
};

const userList = async (req, res, next) => {
  let userList;
  try {
    userList = await User.find(
      {},
      { name: 1, email: 1, roles: 1, status: 1, _id: 0 },
    );
    return res.status(200).json({ userList });
  } catch (err) {
    logger.error(err);
    next(err);
    // return res.status(403).json({ err });
  }
};

const getRolesByEmail = async (req, res, next) => {
  let userRoles;
  const email = req.params.email; // Extract route param
  try {
    if (email) {
      userRoles = await User.findOne({ email: email }, { roles: 1 });
      return res.status(200).send({ email: email, userRoles: userRoles });
    }
  } catch (err) {
    // console.log(err);
    logger.log(err);
    next(err);
    // return res.status(403).json({ err });
  }
};

const deleteUser = async (req, res, next) => {
  const { email } = req.params;
  try {
    const result = await User.findOneAndDelete({ email: email });
    return res.status(200).send({ message: "Role deleted successfully" });
  } catch (err) {
    logger.error(err);
    // return res.status(403).json({ err });
    next(err);
  }
};

module.exports = { updateRoles, userList, deleteUser, getRolesByEmail };
