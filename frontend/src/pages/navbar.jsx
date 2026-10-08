import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserInfo from "../user/userInfo";
import "../navbar/navbar.css"

const Navigation = () => {
    const [error, setError] = useState("");

    const [users, setUsers] = useState(null);
    const [user, setUser] = useState({});
    const [isUser, setIsUser] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }
                if (response.data.role === "user") {
                    setIsUser(true);
                }

                setUser(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load locations.");
            }
        };
        getUsers();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("jwt_token");
        navigate("/login");
    };

    const openInfo = async () => {
        setShowUserInfo(true);
    };

    const handleClose = () => {
        setShowUserInfo(false);
    };

    return (
        <nav className="shark-navbar">
            <div className="shark-navbar-container">
                <div className="shark-logo">🦈 Shark Research</div>

                <button className="hamburger-button" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </button>

                <div className={`shark-nav-links ${menuOpen ? "show-menu" : ""}`}>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/home">
                            Home
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/sharks">
                            Shark
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/habitat">
                            Habitat
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/location">
                            Location
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/sighting">
                            Sighting
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/info">
                            Info
                        </NavLink>
                    </li>

                    {isAdmin && (
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/request">
                                Request
                            </NavLink>
                        </li>
                    )}

                    <li className="nav-item">
                        <Button className="shark-logout-button" onClick={handleLogout}>
                            Logout
                        </Button>
                    </li>

                    <li className="nav-item user-menu">
                        <button className="user-button" onClick={openInfo}>
                            {user?.profile ? <img src={user.profile.startsWith("/uploads/") ? `${import.meta.env.VITE_API_BASE_URL}${user.profile}` : user.profile} alt="Profile" className="navbar-profile-pic" /> : <span className="profile-placeholder">👤</span>}

                            <span>{user?.name}</span>
                        </button>

                        {showUserInfo && (
                            <div className="user-info-box">
                                <UserInfo onClose={handleClose} />
                            </div>
                        )}
                    </li>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
