const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const logIn = async(req,res,next) => {
    const {email , password} = req.body;
    
    let existingUser;
    let token
    let psw = password;
    try{
        existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(404).json({message : "User is not found"})
            }

        const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Incorrect Password!"});
        }
        if(existingUser && existingUser.email){
            token = await tokenGenerate(existingUser.email,existingUser.roles);
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // change to true in production (with HTTPS)
                sameSite: 'Strict',
                maxAge: 60 * 60 * 1000 // 1 hour
              });
        }
        return res.status(200).json({name:existingUser.name, email: existingUser.email,token:token, roles:existingUser.roles});
    }
    catch(err){
     console.log(err);
    }

}



async function tokenGenerate(email,roles){
    const token =  jwt.sign({ email: email,roles:roles }, process.env.SECRET_KEY,{expiresIn: "1h"});
    return token
}

// const validateToken = async(req,res,next) => {
//     const {token ,email } = req.body;
//     const decoded = await tokenVerify(token);
//     if(decoded.email == email){
//         return res.status(200).json({status:'valid',message:'token validated'})
//     }
//     else{
//         return res.status(200).json({status:'invalid',message:'token is not valid'})
//     }
// }

// async function tokenVerify(token){
//     try{
//         const decode = jwt.verify(token, process.env.SECRET_KEY);
//         // console.log(decode,'decode')
//         return decode;
//     }   
//     catch(err){
//         console.log(err);
//     }
// }




module.exports = { logIn };






// const generateToken = async(req,res,next) => {
//     const {email , password} = req.body;
//     let existingUser;
//     let token
//     let psw = password;
//     try{
//      existingUser = await User.findOne({email})
//     //  console.log(existingUser,'existingUser')
//     //  token = jwt.sign({ id: existingUser._id,email: existingUser.email }, process.env.SECRET_KEY);   
//     if(existingUser && existingUser.email){
//         token = await tokenGenerate(existingUser.email,existingUser.roles)
//         // console.log(token)
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: false, // change to true in production (with HTTPS)
//             sameSite: 'Lax',
//             maxAge: 24 * 60 * 60 * 1000 // 1 day
//           });
//         return res.status(200).json({token:token})
//     }
//     }catch(err){
//      console.log(err);
//     }
// }

   // const options= {
    //     token: token,
    //     password: password,
    //     secretKey: 
    // }
    // jwt.verify(token, process.env.SECRET_KEY,(err, decoded) => {
    //     if (err) {
    //         console.error('Token verification failed:', err);
    //     } else {
    //         console.log('Decoded token payload:', decoded);
    //     }
    // });

    // jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    //     if (err) return res.sendStatus(403); // Invalid token
    
    //     req.user = user; // Attach user info to request
    //     next(); // Proceed to next middleware or route handler
    //   });