const User = require("../models/User");
const bcrypt = require("bcryptjs");

const signUp = async(req,res,next) =>{
    const { name , email , password ,roles} = req.body;
    // console.log(req.body,'req.body')
    let existingUser;
 
    try{
     existingUser = await User.findOne({email})
    }catch(e){
     console.log(err);
    }
 
    if(existingUser){
        return res.status(400).json({message : "User is already exists!"})
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,email,
        password: hashedPassword,
        status:'pending',
        roles:roles
    });
    // console.log(user,'user')
    try{
        user.save();
        return res.status(201).json({ user })
    }
    catch(e){console.log(e);}
 }
 
 module.exports = { signUp };