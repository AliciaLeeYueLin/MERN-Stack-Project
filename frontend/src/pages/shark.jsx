import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import EditShark from "../shark/editShark";
import axios from "axios";
import "../shark/shark.css";

function Sharks() {
    const [sharks, setSharks] = useState([]);
    const [habitats, setHabitats] = useState([]);

    const [search, setSearch] = useState("");
    const [diet, setDiet] = useState("All");
    const [habitatId, setHabitatId] = useState("All");
    const [sort, setSort] = useState("nameAsc");

    const [error, setError] = useState("");
    const [selectedShark, setSelectedShark] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isResearcher, setIsResearcher] = useState(false);

    const [showConfirm, setShowConfirm] = useState(null);
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
                if (response.data.role === "researcher") {
                    setIsResearcher(true);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getUser();

        const getHabitats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/habitat/habitats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setHabitats(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getHabitats();

        const getSharks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        search: search,
                        diet: diet,
                        habitat: habitatId,
                        sort: sort,
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
    }, [search, diet, habitatId, sort, navigate]);

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

            setShowConfirm(null);

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

            <div className="filters-container">
                <div className="search-wrapper">
                    <input type="text" placeholder="Search shark..." value={search} onChange={(e) => setSearch(e.target.value)} className="filter-input" />
                </div>

                <div className="select-group">
                    <select className="filter-select" value={diet} onChange={(e) => setDiet(e.target.value)}>
                        <option value="All">All Diets</option>
                        <option value="Carnivore">Carnivore</option>
                        <option value="Piscivore">Piscivore</option>
                        <option value="Planktivore">Planktivore</option>
                    </select>

                    <select className="filter-select" value={habitatId} onChange={(e) => setHabitatId(e.target.value)}>
                        <option value="All">All Habitats</option>

                        {habitats.map((habitat) => (
                            <option key={habitat._id} value={habitat._id}>
                                {habitat.name}
                            </option>
                        ))}
                    </select>

                    <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="nameAsc">Name: A-Z</option>
                        <option value="nameDesc">Name: Z-A</option>
                    </select>
                </div>
            </div>

            {sharks.length === 0 ? (
                <h2 className="no-shark">No shark founded...</h2>
            ) : (
                <div className="shark-grid">
                    {sharks.map((shark) => (
                        <div className="route-card" key={shark._id}>
                            <div className="card-content">
                                {shark.imageUrl && <img src={`${import.meta.env.VITE_API_BASE_URL}${shark.imageUrl}`} alt={shark.name} />}

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
                                    <strong>Habitat:</strong> {shark.habitatId?.name || "Unknown"}
                                </p>
                            </div>
                            <div>
                                <button className="shark-detail-button" onClick={() => navigate(`/sharks/detail/${shark._id}`)}>
                                    &rarr; Explore more about this shark!
                                </button>
                            </div>
                            {(isAdmin || isResearcher) && (
                                <button className="shark-edit" onClick={() => setSelectedShark(shark)}>
                                    Edit
                                </button>
                            )}
                            {(isAdmin || isResearcher) && (
                                <button className="shark-delete" type="button" onClick={() => setShowConfirm(shark._id)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {(isAdmin || isResearcher) && showConfirm && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <h1>Confirmation Deletion</h1>
                        <h3>Are you sure you want to delete this shark?</h3>

                        <button onClick={() => setShowConfirm(false)}>Cancel</button>

                        <button onClick={handleDelete}>Yes, Delete</button>
                    </div>
                </div>
            )}
            {selectedShark && <EditShark shark={selectedShark} onUpdated={handleUpdated} onClose={() => setSelectedShark(null)} />}
        </div>
    );
}

export default Sharks;
