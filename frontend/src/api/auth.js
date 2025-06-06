import axios from 'axios'

const API_URL = "https://capstone-backend-d31e.onrender.com";

export const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem("role", res.data.role);
    return res.data;
};

export const register = async (name, email, password) => {
    return await axios.post(`${API_URL}/register`, { name, email, password });
};
