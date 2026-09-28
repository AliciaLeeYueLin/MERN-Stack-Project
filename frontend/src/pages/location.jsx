import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Locations() {
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getSharks = async () => {
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

        getSharks();
    }, [navigate]);

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

                        <button onClick={() => navigate(`/locations/edit/${location._id}`)}>Edit</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Locations;
