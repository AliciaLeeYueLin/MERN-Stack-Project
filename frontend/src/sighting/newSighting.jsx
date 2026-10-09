import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./sighting.css";

function NewSighting() {
    const navigate = useNavigate();

    const [sharks, setSharks] = useState([]);
    const [locations, setLocations] = useState([]);

    const [sightings, setSightings] = useState({
        sharkId: "",
        locationId: "",
        date: "",
        description: "",
        waterDepth: "",
        waterTemperature: "",
        weatherCondition: "",
        visibility: "",
        sharkCount: "",
        behavior: "",
        observer: "",
        notes: "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getData = async () => {
            try {
                const [sharkResponse, locationResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),

                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/location/locations`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                ]);

                setSharks(sharkResponse.data);
                setLocations(locationResponse.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load sharks and locations.");
            }
        };

        getData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSightings({
            ...sightings,
            [name]: value,
        });
    };

    const handleCancel = () => {
        navigate("/sighting");
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/sighting/sighting`, sightings, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Sighting added successfully.");

            setTimeout(() => {
                navigate("/sighting");
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to add sighting.");
        }
    };

    return (
        <div className="add-sharks-container">
            <div className="add-sharks-card">
                <h1>Add Sighting</h1>

                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}

                <form onSubmit={handleAdd} className="add-form">
                    <div className="form-group">
                        <label>Shark</label>

                        <select name="sharkId" value={sightings.sharkId} onChange={handleChange} required>
                            <option value="">Select a shark</option>

                            {sharks.map((shark) => (
                                <option key={shark._id} value={shark._id}>
                                    {shark.name} - {shark.scientificName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <select name="locationId" value={sightings.locationId} onChange={handleChange} required>
                            <option value="">Select a location</option>

                            {locations.map((location) => (
                                <option key={location._id} value={location._id}>
                                    {location.name} - {location.country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>

                        <input type="date" name="date" value={sightings.date} onChange={handleChange} max={new Date().toLocaleDateString("en-CA")} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Description</label>

                        <textarea name="description" value={sightings.description} onChange={handleChange} rows="5" required />
                    </div>

                    <div className="form-group">
                        <label>Water Depth (m)</label>

                        <input type="number" name="waterDepth" value={sightings.waterDepth} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Water Temperature (°C)</label>

                        <input type="number" name="waterTemperature" value={sightings.waterTemperature} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Weather</label>

                        <select name="weatherCondition" value={sightings.weatherCondition} onChange={handleChange}>
                            <option value="">Select weather</option>

                            <option value="Sunny">☀️ Sunny</option>
                            <option value="Partly Cloudy">🌤️ Partly Cloudy</option>
                            <option value="Cloudy">☁️ Cloudy</option>
                            <option value="Overcast">🌥️ Overcast</option>
                            <option value="Rainy">🌧️ Rainy</option>
                            <option value="Heavy Rain">⛈️ Heavy Rain</option>
                            <option value="Thunderstorm">🌩️ Thunderstorm</option>
                            <option value="Windy">💨 Windy</option>
                            <option value="Foggy">🌫️ Foggy</option>
                            <option value="Stormy">🌪️ Stormy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Visibility</label>

                        <select name="visibility" value={sightings.visibility} onChange={handleChange}>
                            <option value="">Select visibility</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Shark Count</label>

                        <input type="number" name="sharkCount" value={sightings.sharkCount} onChange={handleChange} min="1" />
                    </div>

                    <div className="form-group">
                        <label>Behavior</label>

                        <input type="text" name="behavior" value={sightings.behavior} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Observer</label>

                        <input type="text" name="observer" value={sightings.observer} onChange={handleChange} />
                    </div>

                    {/* Notes */}

                    <div className="form-group">
                        <label>Notes</label>

                        <textarea name="notes" value={sightings.notes} onChange={handleChange} />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="add-button">
                            Add Sighting
                        </button>

                        <button type="button" onClick={handleCancel} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewSighting;
