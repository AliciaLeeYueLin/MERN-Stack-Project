import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditInfo({ users, onClose, onUpdated }) {
    const [name, setName] = useState(users?.name || "");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            onClose();
            return;
        }

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/user/info`,
                {
                    name,
                    password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setMessage("Profile updated successfully.");

            onUpdated(response.data.user);

            if (response.data.passwordChanged) {
                localStorage.removeItem("jwt_token");

                setMessage("Profile updated successfully. You will be redirected to the login page")
                setTimeout(() => {
                    navigate("/login");
                }, 2000);

                return;
            }

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                onClose();
                return;
            }

            if (error.response?.status === 404) {
                setError("User not found.");
            } else {
                setError(error.response?.data?.error || "Failed to update profile.");
            }
        }
    };

    return (
        <div>
            <h3>Change Name and Password</h3>

            {error && <div className="error-message">{error}</div>}

            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleUpdate} className="edit-profile-form">

                <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                </div>

                <button type="submit">Update User</button>

                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditInfo;
