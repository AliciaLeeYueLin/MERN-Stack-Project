import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserInfo from "../component/userInfo";
import ResearcherForm from "../component/researcherForm";


const Navigation = () => {
    const [error, setError] = useState("");

    const [users, setUsers] = useState(null);
    const [user, setUser] = useState({});
    const [isUser, setIsUser] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);

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
                    setIsUser(true)
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

                <div className="shark-nav-links">
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/home">
                            {({ isActive }) => <Button variant={isActive ? "primary" : "outline-primary"}>Home</Button>}
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/sharks">
                            {({ isActive }) => <Button variant={isActive ? "primary" : "outline-primary"}>Shark</Button>}
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/location">
                            {({ isActive }) => <Button variant={isActive ? "primary" : "outline-primary"}>Location</Button>}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/info">
                            {({ isActive }) => <Button variant={isActive ? "primary" : "outline-primary"}>Info</Button>}
                        </NavLink>
                    </li>

                    {isAdmin && (
                        <li className="nav-item">
                            <NavLink className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} to="/request">
                                {({ isActive }) => <Button variant={isActive ? "primary" : "outline-primary"}>Request</Button>}
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
                            {user?.name}
                        </button>

                        {showUserInfo && (
                            <div className="user-info-box">
                                <UserInfo onClose={handleClose} />
                                 {isUser && <ResearcherForm onClose={handleClose} />}
                            </div>
                        )}
                    </li>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
