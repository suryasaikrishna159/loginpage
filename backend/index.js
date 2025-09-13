const express=require("express");
const cors=require("cors");
const cookieparser=require("cookie-parser");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

require("dotenv").config();

//------------------------------------------------------------------------------------------------------------------------

const app=express();

//--------------------------------------------------------middleware-------------------------------------------------------
app.use(cors());
app.use(cookieparser());
app.use(express.json());

//----------------------------------------connecting to database and collections(models)-----------------------------------

const connectdb=require("./config/db.js");
connectdb();

const users=require("./models/user.js");

//--------------------------------------------------------controllers------------------------------------------------------

app.post("/api/v1/register",async (req,res)=>{

    const {name,email,password}=req.body;

    if(!name||!email||!password){
         return res.json({success:false,msg:"credentials missing"});
    }

    try{

        const existinguser=await users.findOne({email});

        if(existinguser){
            return res.json({success:false,msg:"user already exists"});
        }

        const hashedpassword=bcrypt(password);
        const newuser=await users.create({name,email,password:hashedpassword});
        res.json(newuser);

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.Node_env ==="production",
            sameSite: process.env.Node_env === "production"?"none":"strict",
            maxage: 7*24*60*60*1000
        });
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }

})


//----------------------------------------------------------listener-------------------------------------------------------
app.listen(4000,()=>{
    console.log("server started on port 4000");
})

