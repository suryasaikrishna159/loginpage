import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify"

const Home = () => {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/getdata", {withCredentials: true});

        if (res.data.success) {
          setUserdata(res.data.userdata);
        } 
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const logout=async ()=>{
    const logo=await axios.post("http://localhost:4000/api/v1/logout",{}, {withCredentials: true});
    
    if(logo.data.success){
      setUserdata(null); 
      navigate("/");
      toast.success(logo.data.msg);
      
    }

  }

  return (
    <div>
      <div className="hero-section">
        <h3>Welcome To Our Website!!</h3>
        {userdata && <p>Glad to have you here {userdata.name}</p>}
        {!userdata && <button onClick={() => navigate("/login")}>Login</button>}
        {userdata && <button onClick={logout} >Logout</button>}

        {userdata && <button onClick={()=>navigate("/email-verify")}>Verify Email</button>}
      </div>
    </div>
  );
};

export default Home;
