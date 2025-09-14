import React from 'react'
import { useNavigate } from 'react-router-dom'


const Home = () => {
    const navigate=useNavigate();
    
  return (
    <div>
        
        <div className='hero-section'>
            <h3>Welcome To Our Website!!</h3>
            <p>login to have fun</p>
            <button onClick={()=>navigate("/login")}>Login</button>
        </div>
        
        
    </div>
  )
}

export default Home