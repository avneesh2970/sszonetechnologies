import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InstructorSignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instructor/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      alert(res.data.message);
      navigate("/instructor/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">Instructor 5    Signup</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2 w-full mb-2" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 w-full mb-2" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 w-full mb-2" />
      <button className="bg-green-600 text-white px-4 py-2 w-full">Sign Up</button>
    </form>
  );
};

export default InstructorSignUp;
