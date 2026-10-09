import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./info.css";

function NewInfo() {
    const navigate = useNavigate();

    const [information, setInformation] = useState({
        name: "",
        sharkId: "",
        title: "",
        description: "",
        imageUrl: "",
    });

    const [user, setUser] = useState(null);
    const [sharks, setSharks] = useState([]);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setInformation({
            ...information,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/info/info/`, information, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Info added successfully.");

            setTimeout(() => {
                navigate("/info");
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to add info.");
        }
    };

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

                setUser(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load user.");
            }
        };

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

        getUsers();
        getSharks();
    }, [navigate]);

    const handleCancel = () => {
        navigate("/info");
    };

    return (
        <div className="add-sharks-container">
            <div className="add-sharks-card">
                <h1>Add Info</h1>

                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}

                <form onSubmit={handleAdd} className="add-sharks-form">
                    <div className="form-group">
                        <label>Name</label>

                        <input type="text" name="name" value={user?.name || ""} readOnly />
                    </div>

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
                        <label>Image Url</label>

                        <input type="text" name="imageUrl" value={information.imageUrl} onChange={handleChange} />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="add-button">
                            Add Info
                        </button>

                        <button type="button" onClick={handleCancel} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewInfo;
