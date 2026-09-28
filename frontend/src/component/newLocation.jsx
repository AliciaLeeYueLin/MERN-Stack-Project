import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewLocation() {
    const navigate = useNavigate();

    const [locations, setLocations] = useState({
        name: "",
        country:"",
        region:"",
        description: "",
        latitude:"",
        lontitude: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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
                locations, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );

            setMessage("Product added successfully.");

            setTimeout(() => {
                navigate("/location");
            }, 1000);
        } catch (error) {
            if (
                error.response &&
                (error.response.status === 401 ||
                    error.response.status === 403)
            ) {
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

   
return (
    <div className="add-locations-container">
        <div className="add-locations-card">
            <h1>Add Location</h1>

            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleAdd} className="add-locations-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={locations.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        value={locations.country}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Region</label>
                    <input
                        type="text"
                        name="region"
                        value={locations.region}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        value={locations.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Latitude</label>
                    <input
                        type="number"
                        name="latitude"
                        value={locations.latitude}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Longitude</label>
                    <input
                        type="text"
                        name="longitude"
                        value={locations.longitude}
                        onChange={handleChange}
                    />
                </div>

               


                <div className="button-group">
                    <button type="submit" className="add-button">
                        Add Location
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
);


}

export default NewLocation;
