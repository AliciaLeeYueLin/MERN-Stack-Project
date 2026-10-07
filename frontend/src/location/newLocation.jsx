import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewLocation() {
    const navigate = useNavigate();

    const [locations, setLocations] = useState({
        name: "",
        country: "",
        region: "",
        description: "",
        latitude: "",
        longitude: "",
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [locationError, setLocationError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setLocations({
            ...locations,
            [name]: type === "checkbox" ? checked : value,
        });
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
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/location/location/`, 
                locations, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Location added successfully.");

            setTimeout(() => {
                navigate("/location");
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to add locations.");
        }
    };

    const handleCancel = () => {
        navigate("/location");
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
            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: query,
                        format: "json",
                        limit: limit,
                        addressdetails: 1,
                    },
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            return response.data;
        };

      

        const countryResults = await searchNominatim(
            locations.country,
            5
        );

        const countryExists = countryResults.some((result) => {
            return (
                result.addresstype === "country" &&
                result.address?.country
            );
        });

        if (!countryExists) {
            setLocationError(
                `The country "${locations.country}" could not be found.`
            );

            setLocations((prev) => ({
                ...prev,
                latitude: "",
                longitude: "",
            }));

            return;
        }

    

        const regionResults = await searchNominatim(
            `${locations.region}, ${locations.country}`,
            5
        );

        const countryName = locations.country.toLowerCase();

        const regionResult = regionResults.find((result) => {
            const address = result.address;

            if (!address?.country) {
                return false;
            }

            return (
                address.country.toLowerCase() === countryName
            );
        });

        if (!regionResult) {
            setLocationError(
                `The region "${locations.region}" could not be found in "${locations.country}".`
            );

            setLocations((prev) => ({
                ...prev,
                latitude: "",
                longitude: "",
            }));

            return;
        }

       

        const exactResults = await searchNominatim(
            `${locations.name}, ${locations.region}, ${locations.country}`,
            5
        );

        const exactResult = exactResults.find((result) => {
            const address = result.address;

            if (!address?.country) {
                return false;
            }

            return (
                address.country.toLowerCase() === countryName
            );
        });

        if (exactResult) {
            setLocations((prev) => ({
                ...prev,
                latitude: exactResult.lat,
                longitude: exactResult.lon,
            }));

            setMessage(
                "Location found. Exact coordinates have been added."
            );

            return;
        }

      

        const nearbyResults = await searchNominatim(
            `${locations.name}, ${locations.region}`,
            5
        );

        const nearbyResult = nearbyResults.find((result) => {
            const address = result.address;

            if (!address?.country) {
                return false;
            }

            return (
                address.country.toLowerCase() === countryName
            );
        });

        if (nearbyResult) {
            setLocations((prev) => ({
                ...prev,
                latitude: nearbyResult.lat,
                longitude: nearbyResult.lon,
            }));

            setMessage(
                `"${locations.name}" was found nearby. Coordinates have been added.`
            );

            return;
        }
        setLocations((prev) => ({
            ...prev,
            latitude: regionResult.lat,
            longitude: regionResult.lon,
        }));

        setLocationError(
            `"${locations.name}" was not found. Nearby coordinates based on "${locations.region}" have been provided.`
        );

    } catch (error) {
        console.error(error);

        setLocationError(
            "Failed to find coordinates. Please try again."
        );
    }
};

    return (
        <div className="add-sharks-container">
            <div className="add-sharks-card">
                <h1>Add Location</h1>

                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}
                {locationError && <p className="error">{locationError}</p>}

                <form onSubmit={handleAdd} className="add-locations-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={locations.name} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" name="country" value={locations.country} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Region / State</label>
                        <input type="text" name="region" value={locations.region} onChange={handleChange} />
                    </div>

                    <button className="find" type="button" onClick={handleFindCoordinates}>
                        🔎 Find Coordinates
                    </button>

                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" name="description" value={locations.description} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Latitude</label>
                        <input type="number" name="latitude" value={locations.latitude} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Longitude</label>
                        <input type="number" name="longitude" value={locations.longitude} onChange={handleChange} />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="add-button">
                            Add Location
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

export default NewLocation;
