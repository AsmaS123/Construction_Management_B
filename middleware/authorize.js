function hasRole(reqRoles, rolesArr) {
  return reqRoles.some((role) => rolesArr.includes(role));
}

const authorize = (rolesArr) => {
  return (req, res, next) => {
    if (rolesArr.length > 0 && hasRole(req.roles, rolesArr)) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  };
};

module.exports = authorize;
