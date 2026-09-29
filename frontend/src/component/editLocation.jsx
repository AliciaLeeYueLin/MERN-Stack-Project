import { useState } from "react";
import axios from "axios";

function EditLocation({ location, onClose, onUpdated }) {
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
    if (locations[key] !== originalLocation[key]) {
        changedFields[key] = locations[key];
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

                    <div className="form-group">
                        <label>Latitude</label>
                        <input type="number" name="latitude" value={locations.latitude} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Longitude</label>
                        <input type="number" name="longitude" value={locations.longitude} onChange={handleChange} />
                    </div>
                    <button type="submit">Update Location</button>

                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditLocation;
