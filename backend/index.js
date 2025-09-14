require("dotenv").config();

const express=require("express");
const cors=require("cors");
const cookieparser=require("cookie-parser");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const transporter=require("./config/nodemailer.js");

const userauth=require("./middleware/userauth.js");


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

//----------------to register------------------------------------
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

        //sending mail
        const mailoptions={
            from:process.env.SENDERS_EMAIL,
            to:email,
            subject:"welcome to the website",
            text:`HELLO ${name} !!Welcome to the website`
        }

        await transporter.sendMail(mailoptions);


        return res.json({success:true,msg:"user registered successfully"});
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }

    

})

//----------------------to login-------------------------------
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

//------------------------------to logout---------------------
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

//-------------------------------to send otp-------------------------
app.post("/api/v1/sendverifyotp",userauth,async(req,res)=>{

    try{
        const {userid}=req.body;

        const user=await users.findById(userid);

        if(user.isaccountverified){
        return res.json({success:false,msg:"user already verified"});
        }

        const otp=String(Math.floor(100000+Math.random()*100000));
        user.verifyotp=otp;
        user.verifyotpexpireat=Date.now()+24*60*60*1000;
        
        await user.save();

        const mailoptions={
            from:process.env.SENDERS_EMAIL,
            to:user.email,
            subject:"otp verification",
            text:`your otp is ${otp}`
        }

        await transporter.sendMail(mailoptions);

        res.json({success:true,msg:"verification otp sent successfully on your email"});
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }

})


//-------------------------to verify using otp-----------------------------------
app.post("/api/v1/verifyemail",userauth,async (req,res)=>{
    

    const {userid,otp}=req.body;

    if(!userid||!otp){
        return res.json({success:false,msg:"provide credentials"});
    }

    try{

        const user=await users.findById(userid);
        if(!user){
           return res.json({success:false,msg:"User Not Found"});
        }

        if(user.verifyotp===""||user.verifyotp!==otp){
            return res.json({success:false,msg:"Invalid OTP"});
        }

        if(user.verifyotpexpireat<Date.now()){
            return res.json({success:false,msg:"OTP Expired"});
        }

        user.isaccountverified=true;
        user.verifyotp="";
        user.verifyotpexpireat=0;
        await user.save();

        res.json({success:true,msg:"user emailID verified successfully"});

    }
    catch(err){
        res.json({success:false,msg:err.message});
    }
})

//-------------------------------to check authentication---------------------------
app.post("/api/v1/isauth",userauth,async (req,res)=>{
    try{
        res.json({success:true})
    }catch(err){
        res.json({success:false,msg:err.message});
    }
})



//----------------------------------------------------------listener-------------------------------------------------------
app.listen(4000,()=>{
    console.log("server started on port 4000");
})

