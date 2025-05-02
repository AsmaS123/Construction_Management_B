const mongoose = require("mongoose");
require('dotenv').config()
mongoose.set('strictQuery', false);
const MONGO_URI = process.env.mongodburl;
console.log(MONGO_URI,'MONGO_URI')

mongoose.connect(MONGO_URI).then(()=>{
    console.log("connected!");
}).catch((err)=>{
    console.log(err);
})

