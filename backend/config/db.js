const mongoose=require("mongoose");
require("dotenv").config();

const connectdb=async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log(err);
    })

}

module.exports=connectdb;