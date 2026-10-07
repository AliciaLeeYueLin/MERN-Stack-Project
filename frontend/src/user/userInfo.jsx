import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditProfile from "./editProfile";
import ResearcherForm from "./researcherForm";
import EditInfo from "./editInfo";

function UserInfo({ onClose }) {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");
    const [editProfile, setEditProfile] = useState(false);
    const [editInfo, setEditInfo] = useState(false);
    const [form, setForm] = useState(false);
    const [userInfo, setUserInfo] = useState(true);
    const [application, setApplication] = useState(null);
    const [showMessage, setShowMessage] = useState(true)

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

        const getApplication = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/myApplication`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setApplication(response.data);
            } catch (error) {
                if (error.response?.status === 404) {
                    setApplication(null);
                    return;
                }

                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load researcher details.");
            }
        };

        getUsers();
        getApplication();
    }, [navigate]);

    const openEdit = () => {
        setEditProfile(true);
        setUserInfo(false);
    };

    const openEditInfo = () => {
        setEditInfo(true);
        setUserInfo(false);
    };

    const openForm = () => {
        setForm(true);
        setUserInfo(false);
    };

    const closeEdit = () => {
        setEditProfile(false);
        setUserInfo(true);
    };

    const closeEditInfo = () => {
        setEditInfo(false);
        setUserInfo(true);
    };

    const closeForm = () => {
        setForm(false);
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
                                <h5 onClick={openEditInfo}>🖊Change Name and Password</h5>

                                {users.role === "user" && !application && <button onClick={openForm}>Apply as a Researcher!</button>}

                                {application?.status === "rejected" && showMessage && (
                                    <div className="rejected-message">
                                        <h4>Sorry, your Application has been rejected </h4>
                                        <button className="close" onClick={() => setShowMessage(false)}>X</button>
                                    </div>
                                )}

                                {users.role === "researcher" && application && (
                                    <div className="application-info">
                                        <h3>Researcher Application</h3>

                                        <p>
                                            <strong>Organization: </strong>
                                            {application.organization}
                                        </p>

                                        <p>
                                            <strong>Research Field: </strong>
                                            {application.researchField}
                                        </p>

                                        <p>
                                            <strong>Qualification: </strong>
                                            {application.qualification}
                                        </p>

                                        <p>
                                            <strong>Experience: </strong>
                                            {application.experience}
                                        </p>

                                        <p>
                                            <strong>Reason: </strong>
                                            {application.reason}
                                        </p>

                                        <p>
                                            <strong>Status: </strong>
                                            {application.status}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <button onClick={onClose}>Close</button>
                        </div>
                    )}
                </div>
            )}
            {editProfile && <EditProfile users={users} onClose={closeEdit} onUpdated={setUsers} />}
            {editInfo && <EditInfo users={users} onClose={closeEditInfo} onUpdated={setUsers} />}
            {form && <ResearcherForm onClose={closeForm} />}
        </div>
    );
}

export default UserInfo;
