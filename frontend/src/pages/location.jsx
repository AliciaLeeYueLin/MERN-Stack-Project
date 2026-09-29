import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditLocation from "../component/editLocation";

function Locations() {
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getLocation = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/location/locations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLocations(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load locations.");
            }
        };

        getLocation();
    }, [navigate]);

    const handleUpdated = (updatedLocation) => {
        setLocations((oldLocations) => oldLocations.map((location) => (location._id === updatedLocation._id ? updatedLocation : location)));
    };

    return (
        <div className="location-container">
            <div className="location-header">
                <h1>Location</h1>

                <button className="add" onClick={() => navigate(`/location/add/`)}>
                    Add
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="location-grid">
                {locations.map((location) => (
                    <div className="location-card" key={location._id}>
                        {location.imageUrl && <img src={location.imageUrl} alt={location.name} />}
                        <div className="card-content">
                            <h2>{location.name}</h2>
                            <h3>{location.country}</h3>
                            <h3>{location.region}</h3>

                            <p>
                                <strong>Description:</strong>
                                {location.description}
                            </p>

                            <p>
                                <strong>Latitude:</strong> {location.latitude}
                            </p>
                            <p>
                                <strong>Longitude:</strong> {location.longitude}
                            </p>
                        </div>
                        <button className="location-edit" onClick={() => setSelectedLocation(location)}>
                            Edit
                        </button>

                    </div>
                ))}
            </div>
                                    {selectedLocation && <EditLocation location={selectedLocation} onUpdated={handleUpdated} onClose={() => setSelectedLocation(null)} />}

        </div>
    );
}

export default Locations;
