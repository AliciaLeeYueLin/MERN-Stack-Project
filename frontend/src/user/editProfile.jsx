import { useState } from "react";
import axios from "axios";

function EditProfile({ users, onClose, onUpdated }) {
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            onClose();
            return;
        }

        const formData = new FormData();

        if (image) {
            formData.append("profile", image);
        }

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/user/profile/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Profile updated successfully!");

            onUpdated(response.data.user || response.data);

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
                setError("Failed to update profile.");
            }
        }
    };

    return (
        <div>
            <h3>Edit Profile</h3>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleUpdate} className="edit-profile-form">
                <div className="form-group">
                    <label>Profile Picture</label>

                    <input type="file" name="profile" accept="image/*" onChange={handleChange} />
                    {previewUrl && (
                        <div>
                            <h4>Preview:</h4>
                            <img src={previewUrl} alt="Preview" style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "50%" }} />
                        </div>
                    )}
                </div>

                <button type="submit">Update User</button>

                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditProfile;
