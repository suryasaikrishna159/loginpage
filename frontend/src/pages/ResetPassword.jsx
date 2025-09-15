import React,{useState} from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email,setemail]=useState("");
  const [newpassword,setpassword]=useState("");
  const [otpsent,setotpsent]=useState(false);
  const [otp,setotp]=useState();
  const navigate=useNavigate();

  const getotp=async()=>{
      const otpgen=await axios.post("http://localhost:4000/api/v1/sendpasswordresetotp",{email},{ withCredentials: true });
      if(otpgen.data.success){
        toast.success(otpgen.data.msg);
        setotpsent(true);
      }
      else{
        toast.error(otpgen.data.msg);
      }
  }

  const changepassword=async ()=>{
    const chpasw=await axios.post("http://localhost:4000/api/v1/passwordreset",{email,otp,newpassword},{ withCredentials: true });
    
    if(chpasw.data.success){
      toast.success(chpasw.data.msg);
      navigate("/login");
      
    }
    else{
      toast.error(chpasw.data.msg);
    }

  }
  return (
    <div className='outer'>
      <div className='formcard'>
        

        {otpsent ?(<>
        <h2>Forget Password</h2>
        <p></p>
        
        <input type="number" placeholder='OTP' onChange={(e)=>setotp(e.target.value)}/>
        <input type='text' placeholder='Password' onChange={(e)=>setpassword(e.target.value)}/>
        <button onClick={changepassword}>Change Password</button>

          
        </>):(<><h2>Forget Password</h2>
        <p>Please provide your registered email id</p>
        <input type='text' placeholder='Email id' onChange={(e)=>setemail(e.target.value)}/>
        <button onClick={getotp}>Get OTP</button></>)}
      </div>
    </div>
  )
}

export default ResetPassword


{/* <>
        <h2>Forget Password</h2>
        <p>Enter your new password</p>
        <input type='text' placeholder='Password' onChange={(e)=>setpassword(e.target.value)}/>
        <button onClick={changepassword}>Change Password</button>

          
        </> */}