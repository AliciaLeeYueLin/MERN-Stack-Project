import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditLocation from "../location/editLocation";

function Locations() {
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState("");
    const [selectedLocation, setSelectedLocation] = useState(null);
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

    const handleDeleted = (locationId) => {
        setLocations((oldLocations) => oldLocations.filter((location) => location._id !== locationId));
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
                        <button type="button">
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`} target="_blank" rel="noopener noreferrer" className="map-button">
                                🧭 Get Directions
                            </a>
                        </button>

                        {(isAdmin || isResearcher) && (
                            <button className="location-edit" onClick={() => setSelectedLocation(location)}>
                                Edit
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {selectedLocation && <EditLocation location={selectedLocation} onUpdated={handleUpdated} onDeleted={handleDeleted} onClose={() => setSelectedLocation(null)} />}
        </div>
    );
}

export default Locations;
