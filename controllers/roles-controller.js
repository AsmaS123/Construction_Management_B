const User = require("../models/User");
const bcrypt = require("bcryptjs");

const updateRoles = async(req,res,next) =>{
    const { email } = req.params;
    const updatedData  = req.body;
    // console.log(req.body,'req.body')
 
    try{
       const result = await User.findOneAndUpdate({email:email},updatedData );
    //    console.log(result,'result')
       if(result){
        return res.status(200).json({message : 'Role is updated'})
       }
        else{
            return res.status(403).json({message : 'Role not updated'})
        }
    }catch(err){
     console.log(err);
     return res.status(403).json({message : "invalid!"})
    }
}

const userList =  async(req,res,next) =>{
    let userList;
    // console.log(req.email,'req.email')
    try{
        userList = await User.find({},{name:1,email:1,roles:1, status:1,_id:0});
        // console.log(userList,'userList')
        return res.status(200).json({ userList })
       }catch(e){
        console.log(err);
        return res.status(403).json({ err })
       }
 }

 const getRolesByEmail  = async(req,res,next) =>{
     let userRoles;
        const email = req.params.email; // Extract route param
        // console.log(`Site ID: ${siteid}`)
        try{
            if(email){
                userRoles = await User.findOne({email:email},{roles:1});
                // console.log(siteDetail,'siteDetail')
                return res.status(200).send({'email':email,'userRoles':userRoles});
            }
            
        }
        catch(err){
            console.log(err);
            logger.log(err);
            return res.status(403).json({ err })
        }
 }

 const deleteUser  = async(req,res,next) =>{
    const { email } = req.params;
    try{
        const result = await User.findOneAndDelete({email:email});
        return res.status(200).send({'message':'Role deleted successfully'});
    }
    catch(err){
        console.log(err,'err');
        return res.status(403).json({ err })
    }
 }

module.exports = { updateRoles , userList ,deleteUser, getRolesByEmail};