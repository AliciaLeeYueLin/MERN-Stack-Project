import { useState } from "react";
import axios from "axios";

function EditShark({ shark, onClose, onUpdated }) {
    const [sharks, setSharks] = useState({
        name: shark.name || "",
        scientificName: shark.scientificName || "",
        description: shark.description || "",
        averageSize: shark.averageSize || "",
        diet: shark.diet || "",
        habitat: shark.habitat || "",
        imageUrl: shark.imageUrl || "",
        image: null,
    });

    const [originalShark] = useState(shark);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setSharks({
            ...sharks,
            [name]: files ? files[0] : value,
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

        const formData = new FormData();

        if (sharks.name !== originalShark.name) {
            formData.append("name", sharks.name);
        }

        if (sharks.scientificName !== originalShark.scientificName) {
            formData.append("scientificName", sharks.scientificName);
        }

        if (sharks.description !== originalShark.description) {
            formData.append("description", sharks.description);
        }

        if (sharks.averageSize !== originalShark.averageSize) {
            formData.append("averageSize", sharks.averageSize);
        }

        if (sharks.diet !== originalShark.diet) {
            formData.append("diet", sharks.diet);
        }

        if (sharks.habitat !== originalShark.habitat) {
            formData.append("habitat", sharks.habitat);
        }

        if (sharks.image) {
            formData.append("image", sharks.image);
        }

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks/${shark._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Shark updated successfully.");

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
                setError("Shark not found.");
            } else {
                setError("Failed to update shark.");
            }
        }
    };
  
    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h1>Edit Shark</h1>

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <form onSubmit={handleUpdate} className="add-sharks-form">
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

                    <button type="submit">Update Shark</button>

                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>

                 
                </form>
            </div>
        </div>
    );
}

export default EditShark;
