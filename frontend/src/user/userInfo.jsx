import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditProfile from "./editProfile";

function UserInfo({ onClose }) {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");
    const [editProfile, setEditProfile] = useState(false);
    const [userInfo, setUserInfo] = useState(true);

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

    const openEdit = () => {
        setEditProfile(true);
        setUserInfo(false);
    };

    const closeEdit = () => {
        setEditProfile(false);
        setUserInfo(true);
    };

    return (
        <div className="">
            {error && <div className="error-message">{error}</div>}

            {userInfo && (
                <div className="">
                    {users && (
                        <div className="">
                            <div className="">
                                {users?.profile ? <img src={users.profile.startsWith("/uploads/") ? `${import.meta.env.VITE_API_BASE_URL}${users.profile}` : users.profile} alt="Profile" className="info-profile-pic" /> : <span className="profile-placeholder">👤</span>}
                                <h5 onClick={openEdit}>🖊Edit Profile</h5>
                                <h2>
                                    <strong>{users.name}</strong>
                                </h2>
                                <hr />
                                <p>
                                    <strong>Email: </strong>
                                    {users.email}
                                </p>
                                <hr />
                                <p>
                                    <strong>Role: </strong>
                                    {users.role}
                                </p>
                            </div>

                            <button onClick={onClose}>Close</button>
                        </div>
                    )}
                </div>
            )}
            {editProfile && <EditProfile users={users} onClose={closeEdit} onUpdated={setUsers} />}
        </div>
    );
}

export default UserInfo;
