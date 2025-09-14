import React from 'react'
import {Routes,Route, useNavigate} from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import {ToastContainer} from "react-toastify"



const App = () => {

  const navigate=useNavigate();
  return (
    <div>
        <div className='navbar' style={{cursor:'pointer'}}>
            <h2 onClick={()=>navigate("/")}>Nebula</h2>
        </div>
        
        <ToastContainer/>
        <Routes>
          
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/email-verify" element={<EmailVerify/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>

        </Routes>
        
    </div>
  )
}

export default App