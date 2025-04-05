import { useNavigate } from "react-router-dom";

function LogoutButton({setIsAuthenticated}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false); 
        navigate("/"); 
    };

    return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
