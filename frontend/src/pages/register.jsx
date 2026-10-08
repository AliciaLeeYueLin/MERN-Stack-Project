import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../account/account.css";

function Register() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!name || !email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            await api.post("/user/register", {
                name: name,
                email: email,
                password: password,
            });

            setMessage("Register Successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || "Registration failed.");
            } else {
                setError("Unable to connect to the server.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>

                        <input type="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your Name" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>

                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {message && <div className="success-message">{message}</div>}

                    <button type="submit" className="login-button">
                        Register
                    </button>

                    <h4>
                        Already have an account? <a href="/login">Login</a>
                    </h4>
                </form>
            </div>
        </div>
    );
}

export default Register;
