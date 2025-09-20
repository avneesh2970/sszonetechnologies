import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: ""});
  const navigate = useNavigate(); 

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,  loginData , { withCredentials: true });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      alert("Login Successful")
      toast.success("Login Successful");
      navigate("/admin");
    } catch (err) {
      alert(err)
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='w-[500px]'>
        <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
          <h2 className="text-xl font-semibold mb-4">Log In</h2>
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
            <input type="email" required placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="border p-2 rounded" />
            <input type="password" required placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="border p-2 rounded" />
            <div className="flex justify-center mt-4">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Log In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
