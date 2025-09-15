import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import {toast} from "react-toastify"


const Login = () => {
  const navigate=useNavigate();
  const [state,setstate]=useState("signup");
  
  const [name,setname]=useState("");
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");



  
  const submithandler=async (e)=>{
    e.preventDefault();
    try{
        if(state==="signup"){
          const res=await axios.post("http://localhost:4000/api/v1/register",{name,email,password},{ withCredentials: true });
          
          if(res.data.success){
            navigate("/");
            toast.success(res.data.msg);
          }
          else{
              toast.error(res.data.msg);
            }
        }
        else{
            const res=await axios.post("http://localhost:4000/api/v1/login",{email,password},{ withCredentials: true });

            if(res.data.success){
            navigate("/");
            toast.success(res.data.msg);
          }
          else{
              toast.error(res.data.msg);
            }

        }

    }
    catch(err){
      toast.error(res.data.msg);
    }
  }

  return (
    <div className='outer'>
      <div className='formcard'>
        {state==="signup"?<h2>Create Account</h2>:<h2>Login</h2>}
        {state==="signup"?<p>Create your account!</p>:<p>Login to your account! </p>}

        {state==="signup" && <input type='text' placeholder='Full Name' onChange={(e)=>setname(e.target.value)}/>}

        <input type='text' placeholder='Email id' onChange={(e)=>setemail(e.target.value)}/>

        <input type='password' placeholder='password' onChange={(e)=>setpassword(e.target.value)}/>

        <p className='forgot' onClick={()=>navigate("/reset-password")}>Forgot Password?</p>

        
        {state=="signup"?
          (
          <><button onClick={submithandler}>Sign Up</button>
          <p>Already have an account? <span onClick={()=>setstate("login")}>Login here</span></p></>)
        :
          (<><button onClick={submithandler}>Login</button>
          <p>Dont have an account? <span onClick={()=>setstate("signup")}>Sign Up</span></p></>)
        }


      </div>
    </div>
  )
}

export default Login