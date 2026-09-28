import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewShark() {
    const navigate = useNavigate();

    const [sharks, setSharks] = useState({
        name: "",
        scientificName: "",
        description: "",
        averageSize: "",
        diet: "",
        habitat: "",
        image: null,
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        setSharks({
            ...sharks,
            [name]: files ? files[0] : value,
        });
    };

    const handleCancel = () => {
        navigate("/sharks")
    }
   const handleAdd = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt_token");

    if (!token || token.trim() === "") {
        localStorage.removeItem("jwt_token");
        navigate("/");
        return;
    }

    const formData = new FormData();

    formData.append("name", sharks.name);
    formData.append("scientificName", sharks.scientificName);
    formData.append("description", sharks.description);
    formData.append("averageSize", sharks.averageSize);
    formData.append("diet", sharks.diet);
    formData.append("habitat", sharks.habitat);

    if (sharks.image) {
        formData.append("image", sharks.image);
    }

    try {
        await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/shark/shark/`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setMessage("Shark added successfully.");

        setTimeout(() => {
            navigate("/sharks");
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

        setError("Failed to add shark.");
    }
};

    return (
        <div className="add-sharks-container">
            <div className="add-sharks-card">
                <h1>Add Shark</h1>

                {error && <p className="error">{error}</p>}
                {message && <p className="message">{message}</p>}

                <form onSubmit={handleAdd} className="add-sharks-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={sharks.name} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Scientific Name</label>
                        <input type="text" name="scientificName" value={sharks.scientificName} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" name="description" value={sharks.description} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Average Size</label>
                        <input type="text" name="averageSize" value={sharks.averageSize} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Diet</label>
                        <input type="text" name="diet" value={sharks.diet} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Habitat</label>
                        <input type="text" name="habitat" value={sharks.habitat} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleChange} />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="add-button">
                            Add Shark
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

export default NewShark;
