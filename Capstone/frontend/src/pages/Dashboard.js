import { Link } from "react-router-dom";

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome! Here you can view and enroll in classes.</p>

            <nav>
                <ul>
                    <li><Link to="/classes">View Classes</Link></li>
                    <li><Link to="/profile">My Profile</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Dashboard;
