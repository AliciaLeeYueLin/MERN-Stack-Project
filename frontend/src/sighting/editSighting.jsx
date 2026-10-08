import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "./sighting.css";

function EditSighting({ sighting, onClose, onUpdated, onDeleted }) {
    const [sightings, setSightings] = useState({
        sharkId: sighting.sharkId?._id || sighting.sharkId || "",
        locationId: sighting.locationId?._id || sighting.locationId || "",
        date: sighting.date ? sighting.date.substring(0, 10) : "",
        description: sighting.description || "",
        waterDepth: sighting.waterDepth || "",
        waterTemperature: sighting.waterTemperature || "",
        weatherCondition: sighting.weatherCondition || "",
        visibility: sighting.visibility || "",
        sharkCount: sighting.sharkCount || "",
        behavior: sighting.behavior || "",
        observer: sighting.observer || "",
        notes: sighting.notes || "",
    });

    const [sharks, setSharks] = useState([]);
    const [locations, setLocations] = useState([]);

    const [originalSighting] = useState(sighting);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSightings({
            ...sightings,
            [name]: value,
        });
    };

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem("jwt_token");

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
                setError("Failed to load sharks or locations.");
            }
        };

        getData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            onClose();
            return;
        }

        const changedFields = {};

        Object.keys(sightings).forEach((key) => {
            if (sightings[key] !== originalSighting[key]) {
                changedFields[key] = sightings[key];
            }
        });

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/sighting/sighting/${sighting._id}`, changedFields, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Sighting updated successfully.");

            onUpdated(response.data);

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                onClose();
                return;
            }

            setError(error.response?.data?.error || "Failed to update sighting.");
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("jwt_token");
        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            onClose();
            return;
        }

        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/sighting/sighting/${sighting._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowConfirm(null);

            setMessage("Sighting deleted successfully.");
            onDeleted(sighting._id);

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to delete sighting.");
        }
    };
    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h1>Edit Sighting</h1>

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <form onSubmit={handleUpdate} className="">
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

                        <input type="date" name="date" value={sightings.date} onChange={handleChange} required />
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

                    <div className="form-group">
                        <label>Notes</label>

                        <textarea name="notes" value={sightings.notes} onChange={handleChange} />
                    </div>
                    <div className="buttons">
                        <button className="show" type="submit">
                            Update Sighting
                        </button>
                        <button className="update" type="button" onClick={() => setShowConfirm(sighting._id)}>
                            Delete Sighting
                        </button>

                        <button className="remove" type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
               {showConfirm && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                       <h1>Confirmatin Deletion</h1>
                       <h3>Are you sure you want to delete this sighting?</h3>
                        <button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </button>
                     <button variant="danger" onClick={handleDelete}>
                        Yes, Delete
                    </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

export default EditSighting;
