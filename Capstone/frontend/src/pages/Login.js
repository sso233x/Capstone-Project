import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setIsAuthenticated }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/login", formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role); // Store role
            setIsAuthenticated(true);
            navigate(res.data.role === "admin" ? "/admin-dashboard" : "/dashboard"); // Redirect based on role
        } catch (error) {
            console.error("Login failed", error.response?.data);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
