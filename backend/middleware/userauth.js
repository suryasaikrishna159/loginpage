
const jwt=require("jsonwebtoken");

const userauth=async (req,res,next)=>{

    const {token}=req.cookies;
    if(!token){
        return res.json({success:false,msg:"Not Authorized Login Again"});
    }

    try{
        const tokendecode=jwt.verify(token,process.env.JWT_SECRET);

        if(tokendecode.id){
            req.body.userid=tokendecode.id;
        }
        else{
            return res.json({success:false,msg:"Not Authorized Login Again"});
        }

        next();
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }
}

module.exports=userauth;