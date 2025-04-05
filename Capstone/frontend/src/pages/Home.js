import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Welcome to the Gym App</h1>
            <p>Join us today to track your fitness classes!</p>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/register">
                <button>Sign Up</button>
            </Link>
        </div>
    );
}

export default Home;
