import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserInfo({ onClose }) {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");

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

                setUsers(response.data);
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

    return (
        <div className="">
            {error && <div className="error-message">{error}</div>}

            <div className="">
                {users && (
                    <div className="">
                        <div className="">
                            <h2>{users.name}</h2>
                            <p>{users.email}</p>
                            <p>{users.role}</p>
                        </div>

                        <button onClick={onClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserInfo;
