import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditLocation from "../component/editLocation";

function Locations() {
    const [sightings, setSightings] = useState([]);
    const [error, setError] = useState("");
    const [selectedSighting, setSelectedSighting] = useState(null);

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
    }, [navigate]);

    // const handleUpdated = (updatedLocation) => {
    //     setLocations((oldLocations) => oldLocations.map((location) => (location._id === updatedLocation._id ? updatedLocation : location)));
    // };

    return (
        <div className="location-container">
            <div className="location-header">
                <h1>Location</h1>

                <button className="add" onClick={() => navigate(`/sighting/add/`)}>
                    Add
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="sighting-grid">
                {sightings.map((sighting) => (
                    <div className="sighting-card" key={sightings._id}>
                        <div className="card-content">
                             <div className="info-user">
                                <h2>Researcher: {sighting.sharkId?.name}</h2>
                            </div>

                            <h3>Shark: {sighting.locationId?.name}</h3>
                            <h2>{sighting.description}</h2>
                            <h2>{sighting.date}</h2>
                        
                        </div>
                        <button className="sighting-edit" onClick={() => setSelectedSighting(location)}>
                            Edit
                        </button>

                    </div>
                ))}
            </div>
                                    {selectedSighting && <EditLocation location={selectedSighting}  onClose={() => setSelectedSighting(null)} />}
                                        {/* onUpdated={handleUpdated} */}

        </div>
    );
}

export default Locations;
