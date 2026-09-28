import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

function EditInfo({ info, onClose, onUpdated }) {

    const navigate = useNavigate()

    const [information, setInformation] = useState({
        sharkId: info.sharkId?._id || info.sharkId || "",
        title: info.title || "",
        description: info.description || "",
        imageUrl: info.imageUrl || "",
    });

    const [originalInfo] = useState({
        title: info.title || "",
        description: info.description || "",
        imageUrl: info.imageUrl || "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [sharks, setSharks] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setInformation({
            ...information,
            [name]: value,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            onClose();
            return;
        }

        const changedFields = {};

        Object.keys(information).forEach((key) => {
            if (information[key] !== originalInfo[key]) {
                changedFields[key] = information[key];
            }
        });

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/info/info/${info._id}`, changedFields, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage("Info updated successfully.");

            onUpdated(response.data);

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                onClose();
                return;
            }

            setError(error.response?.data?.error || "Failed to update Info.");
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("jwt_token");

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/info/info/${info._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            onClose();
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                onClose();
                return;
            }

            setError("Failed to delete info.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getSharks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSharks(response.data);
            } catch (error) {
                setError("Failed to load sharks.");
            }
        };

        getSharks();
    }, [navigate]);
    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h1>Edit Info</h1>

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <form onSubmit={handleUpdate} className="add-sharks-form">
                    <div className="form-group">
                        <label>Shark</label>

                        <select name="sharkId" value={information.sharkId} onChange={handleChange} required>
                            <option value="">Select a Shark</option>

                            {sharks.map((shark) => (
                                <option value={shark._id} key={shark._id}>
                                    {shark.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={information.title} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" name="description" value={information.description} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" name="imageUrl" value={information.imageUrl} onChange={handleChange} />
                    </div>

                    <button type="submit">Update Info</button>

                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>

                    <button type="button" onClick={handleDelete}>
                        Delete
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditInfo;
