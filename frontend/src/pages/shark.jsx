import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditShark from "../component/editShark";
import axios from "axios";

function Sharks() {
    const [sharks, setSharks] = useState([]);
    const [error, setError] = useState("");
    const [selectedShark, setSelectedShark] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getUser();

        const getSharks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setSharks(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load sharks.");
            }
        };

        getSharks();
    }, [navigate]);

    const handleUpdated = (updatedShark) => {
        setSharks((oldSharks) => oldSharks.map((shark) => (shark._id === updatedShark._id ? updatedShark : shark)));
    };

 
    const handleDelete = async (sharkId) => {
        const token = localStorage.getItem("jwt_token");

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/shark/shark/${sharkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSharks((oldSharks) => oldSharks.filter((shark) => shark._id !== sharkId));
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to delete shark.");
        }
    };

    return (
        <div className="sharks-container">
            <div className="sharks-header">
                <h1>Shark</h1>
            </div>
            <div className="shark-buttons">
                {isAdmin && (
                    <button className="add" onClick={() => navigate(`/sharks/add/`)}>
                        Add
                    </button>
                )}

               
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="shark-grid">
                {sharks.map((shark) => (
                    <div className="route-card" key={shark._id}>
                        {shark.imageUrl && <img src={`${import.meta.env.VITE_API_BASE_URL}${shark.imageUrl}`} alt={shark.name} />}
                        <div className="card-content">
                            <h2>{shark.name}</h2>
                            <p>{shark.scientificName}</p>
                            <p>{shark.description}</p>

                            <p>
                                <strong>Average Size:</strong>
                                {shark.averageSize}
                            </p>

                            <p>
                                <strong>Diet:</strong> {shark.diet}
                            </p>

                            <p>
                                <strong>Habitat:</strong> {shark.habitat}
                            </p>
                        </div>
                        {isAdmin && (
                            <button className="shark-edit" onClick={() => setSelectedShark(shark)}>
                                Edit
                            </button>
                        )}
                        {isAdmin && (
                            <button className="shark-delete" type="button" onClick={() => handleDelete(shark._id)}>
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {selectedShark && <EditShark shark={selectedShark} onUpdated={handleUpdated} onClose={() => setSelectedShark(null)} />}
        </div>
    );
}

export default Sharks;
