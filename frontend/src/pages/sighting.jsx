import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditSighting from "../sighting/editSighting";

function Sighting() {
    const [sightings, setSightings] = useState([]);
    const [error, setError] = useState("");
    const [selectedSighting, setSelectedSighting] = useState(null);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getSighting = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/sighting/sightings`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        search: search,
                    },
                });

                setSightings(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load locations.");
            }
        };

        getSighting();
    }, [search, navigate]);

    const handleUpdated = (updatedSighting) => {
        setSightings((oldSightings) => oldSightings.map((sighting) => (sighting._id === updatedSighting._id ? updatedSighting : sighting)));
    };

    const handleDeleted = (sightingId) => {
        setSightings((oldSightings) => oldSightings.filter((sighting) => sighting._id !== sightingId));
    };

    return (
        <div className="location-container">
            <div className="location-header">
                <h1>Sighting</h1>

                <button className="add" onClick={() => navigate(`/sighting/add/`)}>
                    Add
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            <div className="search-wrapper">
                <input type="text" placeholder="Search Shark OR Location" value={search} onChange={(e) => setSearch(e.target.value)} className="sighting-filter" />
            </div>
            <div className="sighting-grid">
                {sightings.map((sighting) => (
                    <div key={sighting._id}>
                        <div className="card-content">
                            <div className="sighting-user">
                                <h2>Shark: {sighting.sharkId?.name}</h2>
                            </div>
                            <div className="sighting-card">
                                <h3>Location: {sighting.locationId?.name}</h3>
                                <h2>{sighting.description}</h2>
                                <p>Date: {new Date(sighting.date).toLocaleDateString()}</p>

                                <button className="detail" onClick={() => navigate(`/sighting/detail/${sighting._id}`)}>
                                    View Detail
                                </button>
                                <button className="sighting-edit" onClick={() => setSelectedSighting(sighting)}>
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedSighting && <EditSighting sighting={selectedSighting} onUpdated={handleUpdated} onDeleted={handleDeleted} onClose={() => setSelectedSighting(null)} />}
            {/* onUpdated={handleUpdated} */}
        </div>
    );
}

export default Sighting;
