const logOut = async(req,res,next) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
}

module.exports = { logOut  };
