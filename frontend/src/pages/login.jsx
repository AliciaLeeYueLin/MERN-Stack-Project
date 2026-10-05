import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../account/account.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            const response = await api.post(
                "/user/login",           
                {                        
                    email: email,
                    password: password,
                }
            );

            localStorage.setItem("jwt_token", response.data.token); 
            navigate("/home");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Login failed.");
            } else {
                setError("Unable to connect to the server.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>

                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="login-button">
                        Login
                    </button>
                     
                     <h4>Want to register a new account? <a href="/">Register</a></h4>
                </form>
            </div>
        </div>
    );
}

export default Login;