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

        const hashedpassword=await bcrypt.hash(password,10);
        const newuser=await users.create({name,email,password:hashedpassword});
        

        const token=jwt.sign({id:newuser._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite: process.env.NODE_ENV === "production"?"none":"strict",
            maxAge: 7*24*60*60*1000
        });

        return res.json({success:true,msg:"user registered successfully"});
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }

    

})


app.post("/api/v1/login",async (req,res)=>{
    const {email,password}=req.body;

    if(!email||!password){
        res.json({success:false,msg:"enter valid credentials"});
    }

    

    try{
        const emailexists=await users.findOne({email});
        if(!emailexists){
            return res.json({success:false,msg:"invalid email"});
        }

        const ismatch=await bcrypt.compare(password,emailexists.password);
        if(!ismatch){
            return res.json({success:false,msg:"invalid password"});
        }

        const token=jwt.sign({id:emailexists._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite: process.env.NODE_ENV === "production"?"none":"strict",
            maxAge: 7*24*60*60*1000
        });

        return res.json({success:true,msg:"user loggedin successfully"});
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }

})

app.post("/api/v1/logout",async (req,res)=>{

    try{
        res.clearCookie("token",{
            httpOnly:true,
            secure:process.env.NODE_ENV ==="production",
            sameSite: process.env.NODE_ENV === "production"?"none":"strict",
            maxAge: 7*24*60*60*1000
        })

        res.json({success:true,msg:"user logged out successfully"});
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }
})

//----------------------------------------------------------listener-------------------------------------------------------
app.listen(4000,()=>{
    console.log("server started on port 4000");
})

