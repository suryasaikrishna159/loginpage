import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {

  const [login,setlogin]=useState(false);
  const navigate=useNavigate();

  const [otpgenerated,setotpgenerated]=useState(false);
  const [otp,setotp]=useState();

  const checkiflogedin=async()=>{
      const checllogin=await axios.post("http://localhost:4000/api/v1/isauth",{},{withCredentials: true});
      if(checllogin.data.success){
        setlogin(true);
      }else{
        toast.error(checllogin.data.msg);
      }
    }

    const verify=async ()=>{
      const ver=await axios.post("http://localhost:4000/api/v1/verifyemail",{otp},{withCredentials: true});
      if(ver.data.success){
        toast.success(ver.data.msg);
        
      }
      else{
        toast.error(ver.data.msg);
        
      }
    }
  
  const genotp=async()=>{
    const getotp=await axios.post("http://localhost:4000/api/v1/sendverifyotp",{},{withCredentials: true})
    if(getotp.data.success){
      toast.success(getotp.data.msg);
      setotpgenerated(true);
    }
    else{
      toast.error(getotp.data.msg);
    }
  }

  useEffect(()=>{
    
    checkiflogedin();
  },[])

  return (
    <div className='outer'>
      <div className='formcard'>
        {login ?(<>

        
        {!otpgenerated && <><h2>Verify Email</h2>
        <p>Generate OTP</p>
        <button onClick={genotp}>Get OTP</button></>}

        {otpgenerated && <>
          <h2>Verify Email</h2>
        <p>Enter OTP</p>
        <input type='number' onChange={(e)=>setotp(e.target.value)}/>
        <button onClick={verify}>verify</button>
        </>}

        </>):(<><p>Login to verify..</p><button onClick={()=>navigate("/home")}>home</button>
        </>)}
        
      </div>
    </div>
  )
}

export default EmailVerify