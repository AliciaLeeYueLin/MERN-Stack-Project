import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./info.css";

function EditInfo() {
    const [info, setInfo] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState(null);

    const [information, setInformation] = useState({
        sharkId: "",
        title: "",
        description: "",
        imageUrl: "",
        image: null,
        isPublic: true,
    });

    const [sharks, setSharks] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setInformation({
            ...information,
            [name]: files ? files[0] : value,
        });
    };

    const handleEdit = (selected) => {
        setSelectedInfo(selected);

        setInformation({
            sharkId: selected.sharkId?._id || selected.sharkId || "",
            title: selected.title || "",
            description: selected.description || "",
            imageUrl: selected.imageUrl || "",
            image: null,
            isPublic: selected.isPublic ?? false,
        });
        setError("");
        setMessage("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const formData = new FormData();

        const originalSharkId = selectedInfo.sharkId?._id || selectedInfo.sharkId || "";

        if (information.sharkId !== originalSharkId) {
            formData.append("sharkId", information.sharkId);
        }

        if (information.title !== selectedInfo.title) {
            formData.append("title", information.title);
        }

        if (information.description !== selectedInfo.description) {
            formData.append("description", information.description);
        }

        if (information.isPublic !== selectedInfo.isPublic) {
            formData.append("isPublic", String(information.isPublic));
        }

        if (information.image) {
            formData.append("image", information.image);
        }

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/info/info/${selectedInfo._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Info updated successfully.");

            setInfo((oldInfo) => oldInfo.map((i) => (i._id === response.data._id ? response.data : i)));

            setSelectedInfo(null);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
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
            navigate("/");
            return;
        }

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/info/info/${selectedInfo._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setInfo((oldInfo) => oldInfo.filter((i) => i._id !== selectedInfo._id));

            setShowConfirm(false);
            setSelectedInfo(null);
            setMessage("Info deleted successfully.");
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
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
        const getData = async () => {
            const token = localStorage.getItem("jwt_token");

            if (!token || token.trim() === "") {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            try {
                const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const currentUser = userResponse.data;

                const infoResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/info/info`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const ownInfo = infoResponse.data.filter((i) => i.userId?._id === currentUser._id);

                setInfo(ownInfo);

                const sharkResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSharks(sharkResponse.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load your info.");
            }
        };

        getData();
    }, [navigate]);

    return (
        <div className="info-container">
            <div className="info-header">
                <h1>Edit My Info</h1>
            </div>

            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}

            {info.length === 0 && !error && <p>You have not added any info yet.</p>}

            <div className="info-grid">
                {info.map((i) => (
                    <div className="content" key={i._id}>
                        <div className="info-card">
                            <div className="info-user">
                                <h2>Researcher: {i.userId?.name}</h2>
                                {i.isPublic && <p className="badge-public">Public</p>}
                                {!i.isPublic && <p className="badge-private">Private</p>}
                            </div>

                            <h3>Shark: {i.sharkId?.name}</h3>

                            {i.imageUrl && <img src={`${import.meta.env.VITE_API_BASE_URL}${i.imageUrl}`} alt={i.sharkId?.name} />}

                            <div className="info-content">
                                <h3>{i.title}</h3>

                                <p>{i.description}</p>

                                <button type="button" onClick={() => handleEdit(i)}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedInfo && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <h1>Edit Info</h1>

                        <form onSubmit={handleUpdate} className="add-form">
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

                            <div className="public-checkbox">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={information.isPublic}
                                    onChange={(e) =>
                                        setInformation({
                                            ...information,
                                            isPublic: e.target.checked,
                                        })
                                    }
                                />

                                <label htmlFor="isPublic">Make this information public</label>

                                <p>{information.isPublic ? "Everyone can view this information." : "Only you and the admin can view this information."}</p>
                            </div>

                            <div className="form-group">
                                <label>Image</label>

                                <input type="file" name="image" accept="image/*" onChange={handleChange} />
                            </div>

                            <button type="submit">Update Info</button>

                            <button type="button" onClick={() => setShowConfirm(true)}>
                                Delete Info
                            </button>

                            <button type="button" onClick={() => setSelectedInfo(null)}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {showConfirm && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <h1>Confirmatin Deletion</h1>
                        <h3>Are you sure you want to delete this info?</h3>
                        <button variant="secondary" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </button>
                        <button variant="danger" onClick={handleDelete}>
                            Yes, Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditInfo;
