import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditShark from "../shark/editShark";
import axios from "axios";

function Sharks() {
    const [sharks, setSharks] = useState([]);

    const [search, setSearch] = useState("");
    const [diet, setDiet] = useState("All");
    const [habitat, setHabitat] = useState("All");
    const [sort, setSort] = useState("nameAsc");

    const [error, setError] = useState("");
    const [selectedShark, setSelectedShark] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isResearcher, setIsResearcher] = useState(false);

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

        const getSharks = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        search: search,
                        diet: diet,
                        habitat: habitat,
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
    }, [search, diet, habitat, sort, navigate]);

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

                    <select className="filter-select" value={habitat} onChange={(e) => setHabitat(e.target.value)}>
                        <option value="All">All Habitats</option>
                        <option value="Coastal">Coastal</option>
                        <option value="Coral Reef">Coral Reef</option>
                        <option value="Open Ocean">Open Ocean</option>
                        <option value="Deep Sea">Deep Sea</option>
                        <option value="Estuary">Estuary</option>
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
                                    <strong>Habitat:</strong> {shark.habitat}
                                </p>
                            </div>
                            <button className="shark-detail" onClick={() => navigate(`/shark/detail/${shark._id}`)}>Explore more about this shark!</button>
                            {(isAdmin || isResearcher) && (
                                <button className="shark-edit" onClick={() => setSelectedShark(shark)}>
                                    Edit
                                </button>
                            )}
                            {(isAdmin || isResearcher) && (
                                <button className="shark-delete" type="button" onClick={() => handleDelete(shark._id)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {selectedShark && <EditShark shark={selectedShark} onUpdated={handleUpdated} onClose={() => setSelectedShark(null)} />}
        </div>
    );
}

export default Sharks;
