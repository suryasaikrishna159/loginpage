const mongoose=require("mongoose");

const userschema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verifyotp:{type:String,default:''},
    verifyotpexpireat:{type:Number,default:0},
    isaccountverified:{type:Boolean,default:false},
    resetotp:{type:String,default:''},
    resetotpexpireat:{type:Number,default:0},
})

module.exports=mongoose.model("users",userschema);