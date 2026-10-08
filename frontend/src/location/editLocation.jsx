import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./location.css";

import axios from "axios";

function EditLocation({ location, onClose, onUpdated, onDeleted }) {
    const [locations, setLocations] = useState({
        name: location.name || "",
        country: location.country || "",
        region: location.region || "",
        latitude: location.latitude || "",
        longitude: location.longitude || "",
    });

    const [originalLocation] = useState(location);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(null);
    const [locationError, setLocationError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setLocations({
            ...locations,
            [name]: value,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            onClose();
            return;
        }

        const changedFields = {};

        Object.keys(locations).forEach((key) => {
            let newValue = locations[key];
            let originalValue = originalLocation[key];

            if (key === "latitude" || key === "longitude") {
                newValue = Number(newValue);
                originalValue = Number(originalValue);
            }

            if (newValue !== originalValue) {
                changedFields[key] = newValue;
            }
        });
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/location/location/${location._id}`, changedFields, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Location updated successfully.");

            onUpdated(response.data);

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.log(error.response?.data);

            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                onClose();
                return;
            }

            if (error.response?.status === 404) {
                setError("Location not found.");
            } else {
                setError("Failed to update info.");
            }
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
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/location/location/${location._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowConfirm(null);
            setMessage("Location deleted successfully.");
            onDeleted(location._id);

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to delete location.");
        }
    };

    const handleFindCoordinates = async () => {
        if (!locations.name || !locations.country || !locations.region) {
            setLocationError("Please enter the name, country and region.");
            return;
        }

        try {
            setLocationError("");
            setMessage("");

            const searchNominatim = async (query, limit = 5) => {
                const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                    params: {
                        q: query,
                        format: "json",
                        limit: limit,
                        addressdetails: 1,
                    },
                    headers: {
                        Accept: "application/json",
                    },
                });

                return response.data;
            };

            const countryResults = await searchNominatim(locations.country, 5);

            const countryExists = countryResults.some((result) => {
                return result.addresstype === "country" && result.address?.country;
            });

            if (!countryExists) {
                setLocationError(`The country "${locations.country}" could not be found.`);

                setLocations((prev) => ({
                    ...prev,
                    latitude: "",
                    longitude: "",
                }));

                return;
            }

            const regionResults = await searchNominatim(`${locations.region}, ${locations.country}`, 5);

            const countryName = locations.country.toLowerCase();

            const regionResult = regionResults.find((result) => {
                const address = result.address;

                if (!address?.country) {
                    return false;
                }

                return address.country.toLowerCase() === countryName;
            });

            if (!regionResult) {
                setLocationError(`The region "${locations.region}" could not be found in "${locations.country}".`);

                setLocations((prev) => ({
                    ...prev,
                    latitude: "",
                    longitude: "",
                }));

                return;
            }

            const exactResults = await searchNominatim(`${locations.name}, ${locations.region}, ${locations.country}`, 5);

            const exactResult = exactResults.find((result) => {
                const address = result.address;

                if (!address?.country) {
                    return false;
                }

                return address.country.toLowerCase() === countryName;
            });

            if (exactResult) {
                setLocations((prev) => ({
                    ...prev,
                    latitude: Number(exactResult.lat),
                    longitude: Number(exactResult.lon),
                }));

                setMessage("Location found. Exact coordinates have been added.");

                return;
            }

            const nearbyResults = await searchNominatim(`${locations.name}, ${locations.region}`, 5);

            const nearbyResult = nearbyResults.find((result) => {
                const address = result.address;

                if (!address?.country) {
                    return false;
                }

                return address.country.toLowerCase() === countryName;
            });

            if (nearbyResult) {
                setLocations((prev) => ({
                    ...prev,
                    latitude: Number(nearbyResult.lat),
                    longitude: Number(nearbyResult.lon),
                }));

                setMessage(`"${locations.name}" was found nearby. Coordinates have been added.`);

                return;
            }

            setLocations((prev) => ({
                ...prev,
                latitude: Number(regionResult.lat),
                longitude: Number(regionResult.lon),
            }));

            setLocationError(`"${locations.name}" was not found. Nearby coordinates based on "${locations.region}" have been provided.`);
        } catch (error) {
            console.error(error);

            setLocationError("Failed to find coordinates. Please try again.");
        }
    };
    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h1>Edit Location</h1>

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <form onSubmit={handleUpdate} className="">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={locations.name} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" name="country" value={locations.country} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Region</label>
                        <input type="text" name="region" value={locations.region} onChange={handleChange} />
                    </div>

                    <button className="find" type="button" onClick={handleFindCoordinates}>
                        🔎 Find Coordinates
                    </button>

                    <div className="form-group">
                        <label>Latitude</label>
                        <input type="number" step="any" name="latitude" value={locations.latitude} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Longitude</label>
                        <input type="number" step="any" name="longitude" value={locations.longitude} onChange={handleChange} />{" "}
                    </div>
                    <div className="buttons">
                        <button className="show" type="submit">
                            Update Location
                        </button>

                        <button className="update" type="button" onClick={() => setShowConfirm(location._id)}>
                            Delete
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
                       <h3>Are you sure you want to delete this location?</h3>
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

export default EditLocation;
