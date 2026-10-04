import { useState, useEffect } from "react";
import axios from "axios";

function EditInfo({ info, onClose, onUpdated, onDeleted }) {
    const [information, setInformation] = useState({
        sharkId: info.sharkId?._id || "",
        title: info.title || "",
        description: info.description || "",
        imageUrl: info.imageUrl || "",
    });

    const [originalInfo] = useState(info);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [sharks, setSharks] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setInformation({
            ...information,
            [name]: files ? files[0] : value,
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

        const formData = new FormData();

        if (information.sharkId !== (originalInfo.sharkId?._id || originalInfo.sharkId)) {
            formData.append("sharkId", information.sharkId);
        }

        if (information.title !== originalInfo.title) {
            formData.append("title", information.title);
        }

        if (information.description !== originalInfo.description) {
            formData.append("description", information.description);
        }

        if (information.image) {
            formData.append("image", information.image);
        }

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/info/info/${info._id}`, formData, {
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

            if (error.response?.status === 404) {
                setError("Info not found.");
            } else {
                setError("Failed to update info.");
            }
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("jwt_token");
        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            onClose();
            return;
        }

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/info/info/${info._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Info deleted successfully.");
            onDeleted(info._id);

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
                setError("Info not found.");
            } else {
                setError("Failed to delete info.");
            }
        }
    };

    useEffect(() => {
        const getSharks = async () => {
            try {
                const token = localStorage.getItem("jwt_token");

                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSharks(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getSharks();
    }, []);

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h1>Edit Info</h1>

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <form onSubmit={handleUpdate} className="add-sharks-form">
                    <div className="form-group">
                        <label>Shark</label>

                        <select name="sharkId" value={information.sharkId} onChange={handleChange}>
                            <option value="">Select a shark</option>

                            {sharks.map((shark) => (
                                <option key={shark._id} value={shark._id}>
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
                        <textarea name="description" value={information.description} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} />
                    </div>

                    <button type="submit">Update Info</button>
                    <button type="button" onClick={handleDelete}>
                        Delete Info
                    </button>

                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditInfo;
