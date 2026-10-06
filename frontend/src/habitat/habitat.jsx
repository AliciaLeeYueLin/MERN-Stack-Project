import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./habitat.css";

function Habitats() {
    const [habitats, setHabitats] = useState([]);
    const [newHabitat, setNewHabitat] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const getHabitats = async () => {
            const token = localStorage.getItem("jwt_token");

            if (!token || token.trim() === "") {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/habitat/habitats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setHabitats(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load habitats.");
            }
        };

        getHabitats();
    }, [navigate]);

    const handleAddHabitat = async (e) => {
        e.preventDefault();

        if (!newHabitat.trim()) {
            setError("Please enter a habitat name.");
            return;
        }

        const token = localStorage.getItem("jwt_token");

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/habitat/habitat`,
                {
                    name: newHabitat,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setHabitats((oldHabitats) => [...oldHabitats, response.data]);

            setNewHabitat("");
            setShowAdd(false);
            setError("");
            setMessage("Habitat added successfully.");
        } catch (error) {
            setError(error.response?.data?.error || "Failed to add habitat.");
        }
    };

    const handleDelete = async (habitatId) => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/habitat/habitat/${habitatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHabitats((oldHabitats) => oldHabitats.filter((habitat) => habitat._id !== habitatId));

            setError("");
            setMessage("Habitat deleted successfully.");
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError(error.response?.data?.error || "Failed to delete habitat.");
        }
    };

    return (
        <div className="habitats-container">
            <div className="habitats-header">
                <h1>Habitats</h1>

                <button className="add" onClick={() => setShowAdd(!showAdd)}>
                    {showAdd ? "Cancel" : "+ Add Habitat"}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {message && <div className="success-message">{message}</div>}

            {showAdd && (
                <form className="add-habitat-form" onSubmit={handleAddHabitat}>
                    <label>Habitat Name</label>

                    <input type="text" value={newHabitat} onChange={(e) => setNewHabitat(e.target.value)} placeholder="Enter habitat name" />

                    <button type="submit" className="add">
                        Add Habitat
                    </button>
                </form>
            )}

            <div className="habitat-grid">
                {habitats.map((habitat) => (
                    <div className="habitat-card" key={habitat._id}>
                        <h2>{habitat.name}</h2>

                        <button className="delete-habitat-button" onClick={() => handleDelete(habitat._id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {habitats.length === 0 && <h2>No habitats found.</h2>}
        </div>
    );
}

export default Habitats;
