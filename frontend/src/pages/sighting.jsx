import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditSighting from "../sighting/editSighting";
import "../sighting/sighting.css";

function Sighting() {
    const [sightings, setSightings] = useState([]);
    const [error, setError] = useState("");
    const [selectedSighting, setSelectedSighting] = useState(null);
    const [search, setSearch] = useState("");
    const [expandedSighting, setExpandedSighting] = useState(null);

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

                setError("Failed to load sightings.");
            }
        };

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

        getSighting();
    }, [search, navigate]);

    const handleUpdated = (updatedSighting) => {
        setSightings((oldSightings) => oldSightings.map((sighting) => (sighting._id === updatedSighting._id ? updatedSighting : sighting)));
    };

    const handleDeleted = (sightingId) => {
        setSightings((oldSightings) => oldSightings.filter((sighting) => sighting._id !== sightingId));
    };

    return (
        <div className="sighting-container">
            <div className="sighting-header">
                <h1>Sighting</h1>

                {(isAdmin || isResearcher) && (
                    <button className="add" onClick={() => navigate("/sighting/add")}>
                        Add
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-wrapper">
                <input type="text" placeholder="Search Shark OR Location" value={search} onChange={(e) => setSearch(e.target.value)} className="sighting-filter" />
            </div>

            <div className="sighting-grid">
                {sightings.map((sighting) => (
                    <div className="sighting-item" key={sighting._id}>
                        <div className="sighting-user">
                            <h2>Shark: {sighting.sharkId?.name}</h2>
                        </div>

                        <div className="sighting-card">
                            <div className="card-content">
                                <h3>Location: {sighting.locationId?.name}</h3>

                                <h4 className={expandedSighting === sighting._id ? "description-expanded" : "description-collapsed"}>{sighting.description}</h4>

                                {sighting.description?.length > 120 && (
                                    <button type="button" className="read-more" onClick={() => setExpandedSighting(expandedSighting === sighting._id ? null : sighting._id)}>
                                        {expandedSighting === sighting._id ? "Read Less" : "Read More"}
                                    </button>
                                )}

                                <p>Date: {new Date(sighting.date).toLocaleDateString()}</p>

                                <button className="detail" onClick={() => navigate(`/sighting/detail/${sighting._id}`)}>
                                    View Detail
                                </button>

                                {(isAdmin || isResearcher) && (
                                    <button className="sighting-edit" onClick={() => setSelectedSighting(sighting)}>
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedSighting && <EditSighting sighting={selectedSighting} onUpdated={handleUpdated} onDeleted={handleDeleted} onClose={() => setSelectedSighting(null)} />}
        </div>
    );
}

export default Sighting;
