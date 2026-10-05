import { useState } from "react";
import axios from "axios";
import "./shark.css";

function EditShark({ shark, onClose, onUpdated }) {
    const [sharks, setSharks] = useState({
        name: shark.name || "",
        scientificName: shark.scientificName || "",
        description: shark.description || "",
        averageSize: shark.averageSize || "",
        diet: shark.diet || "",
        dietDetails: shark.dietDetails || "",
        habitat: shark.habitat || "",
        habitatDetails: shark.habitatDetails || "",

        reproduction: {
            type: shark.reproduction?.type || "",
            maturityAge: shark.reproduction?.maturityAge || "",
            gestationPeriod: shark.reproduction?.gestationPeriod || "",
            offspringCount: shark.reproduction?.offspringCount || "",
            birthSize: shark.reproduction?.birthSize || "",
            details: shark.reproduction?.details || "",
        },

        lifeCycle: shark.lifeCycle || [],
        characteristics: shark.characteristics || [],

        imageUrl: shark.imageUrl || "",
        image: null,
    });

    const dietOptions = [
        "Carnivore",
        "Piscivore",
        "Planktivore",
        "Omnivore",
    ];

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

    const handleReproductionChange = (e) => {
        const { name, value } = e.target;

        setSharks({
            ...sharks,
            reproduction: {
                ...sharks.reproduction,
                [name]: value,
            },
        });
    };

    const handleLifeCycleChange = (index, field, value) => {
        const updated = [...sharks.lifeCycle];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setSharks({
            ...sharks,
            lifeCycle: updated,
        });
    };

    const addLifeCycleStage = () => {
        setSharks({
            ...sharks,
            lifeCycle: [
                ...sharks.lifeCycle,
                {
                    stage: "",
                    description: "",
                    approximateDuration: "",
                },
            ],
        });
    };

    const removeLifeCycleStage = (index) => {
        const updated = sharks.lifeCycle.filter(
            (_, i) => i !== index
        );

        setSharks({
            ...sharks,
            lifeCycle: updated,
        });
    };

    const handleCharacteristicChange = (
        index,
        field,
        value
    ) => {
        const updated = [...sharks.characteristics];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setSharks({
            ...sharks,
            characteristics: updated,
        });
    };

    const addCharacteristic = () => {
        setSharks({
            ...sharks,
            characteristics: [
                ...sharks.characteristics,
                {
                    characteristic: "",
                    description: "",
                },
            ],
        });
    };

    const removeCharacteristic = (index) => {
        const updated = sharks.characteristics.filter(
            (_, i) => i !== index
        );

        setSharks({
            ...sharks,
            characteristics: updated,
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

        if (
            sharks.scientificName !==
            originalShark.scientificName
        ) {
            formData.append(
                "scientificName",
                sharks.scientificName
            );
        }

        if (sharks.description !== originalShark.description) {
            formData.append("description", sharks.description);
        }

        if (sharks.averageSize !== originalShark.averageSize) {
            formData.append(
                "averageSize",
                sharks.averageSize
            );
        }

        if (sharks.diet !== originalShark.diet) {
            formData.append("diet", sharks.diet);
        }

        if (sharks.dietDetails !== originalShark.dietDetails) {
            formData.append(
                "dietDetails",
                sharks.dietDetails
            );
        }

        if (sharks.habitat !== originalShark.habitat) {
            formData.append("habitat", sharks.habitat);
        }

        if (
            sharks.habitatDetails !==
            originalShark.habitatDetails
        ) {
            formData.append(
                "habitatDetails",
                sharks.habitatDetails
            );
        }

        formData.append(
            "reproduction",
            JSON.stringify(sharks.reproduction)
        );

        formData.append(
            "lifeCycle",
            JSON.stringify(sharks.lifeCycle)
        );

        formData.append(
            "characteristics",
            JSON.stringify(sharks.characteristics)
        );

        if (sharks.image) {
            formData.append("image", sharks.image);
        }

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_BASE_URL}/shark/sharks/${shark._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Shark updated successfully.");

            onUpdated(response.data);

            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error) {
            if (
                error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )
            ) {
                localStorage.removeItem("jwt_token");
                onClose();
                return;
            }

            if (error.response?.status === 404) {
                setError("Shark not found.");
            } else {
                setError(
                    error.response?.data?.error ||
                    "Failed to update shark."
                );
            }
        }
    };

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h1>Edit Shark</h1>

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <form
                    onSubmit={handleUpdate}
                    className="add-form"
                >
                    <h2>Basic Information</h2>

                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={sharks.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Scientific Name</label>

                        <input
                            type="text"
                            name="scientificName"
                            value={sharks.scientificName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={sharks.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Average Size</label>

                        <input
                            type="text"
                            name="averageSize"
                            value={sharks.averageSize}
                            onChange={handleChange}
                        />
                    </div>

                    <h2>Diet</h2>

                    <div className="form-group">
                        <label>Diet</label>

                        <select
                            name="diet"
                            value={sharks.diet}
                            onChange={handleChange}
                        >
                            <option value="">
                                Select a diet
                            </option>

                            {dietOptions.map((diet) => (
                                <option
                                    key={diet}
                                    value={diet}
                                >
                                    {diet}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Diet Details</label>

                        <textarea
                            name="dietDetails"
                            value={sharks.dietDetails}
                            onChange={handleChange}
                        />
                    </div>

                    <h2>Habitat</h2>

                    <div className="form-group">
                        <label>Habitat</label>

                        <input
                            type="text"
                            name="habitat"
                            value={sharks.habitat}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Habitat Details</label>

                        <textarea
                            name="habitatDetails"
                            value={sharks.habitatDetails}
                            onChange={handleChange}
                        />
                    </div>

                    <h2>Reproduction</h2>

                    <div className="form-group">
                        <label>Type</label>

                        <input
                            type="text"
                            name="type"
                            value={sharks.reproduction.type}
                            onChange={handleReproductionChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Maturity Age</label>

                        <input
                            type="text"
                            name="maturityAge"
                            value={sharks.reproduction.maturityAge}
                            onChange={handleReproductionChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gestation Period</label>

                        <input
                            type="text"
                            name="gestationPeriod"
                            value={
                                sharks.reproduction
                                    .gestationPeriod
                            }
                            onChange={handleReproductionChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Offspring Count</label>

                        <input
                            type="text"
                            name="offspringCount"
                            value={
                                sharks.reproduction
                                    .offspringCount
                            }
                            onChange={handleReproductionChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Birth Size</label>

                        <input
                            type="text"
                            name="birthSize"
                            value={
                                sharks.reproduction.birthSize
                            }
                            onChange={handleReproductionChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Reproduction Details</label>

                        <textarea
                            name="details"
                            value={sharks.reproduction.details}
                            onChange={handleReproductionChange}
                        />
                    </div>

                    <h2>Life Cycle</h2>

                    {sharks.lifeCycle.map((stage, index) => (
                        <div
                            key={index}
                            className="form-group"
                        >
                            <label>Stage</label>

                            <input
                                type="text"
                                value={stage.stage}
                                onChange={(e) =>
                                    handleLifeCycleChange(
                                        index,
                                        "stage",
                                        e.target.value
                                    )
                                }
                            />

                            <label>Description</label>

                            <textarea
                                value={stage.description}
                                onChange={(e) =>
                                    handleLifeCycleChange(
                                        index,
                                        "description",
                                        e.target.value
                                    )
                                }
                            />

                            <label>
                                Approximate Duration
                            </label>

                            <input
                                type="text"
                                value={
                                    stage.approximateDuration
                                }
                                onChange={(e) =>
                                    handleLifeCycleChange(
                                        index,
                                        "approximateDuration",
                                        e.target.value
                                    )
                                }
                            />

                            {sharks.lifeCycle.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeLifeCycleStage(
                                            index
                                        )
                                    }
                                >
                                    Remove Stage
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addLifeCycleStage}
                    >
                        + Add Life Cycle Stage
                    </button>

                    <h2>Characteristics</h2>

                    {sharks.characteristics.map(
                        (characteristic, index) => (
                            <div
                                key={index}
                                className="form-group"
                            >
                                <label>
                                    Characteristic
                                </label>

                                <input
                                    type="text"
                                    value={
                                        characteristic.characteristic
                                    }
                                    onChange={(e) =>
                                        handleCharacteristicChange(
                                            index,
                                            "characteristic",
                                            e.target.value
                                        )
                                    }
                                />

                                <label>Description</label>

                                <textarea
                                    value={
                                        characteristic.description
                                    }
                                    onChange={(e) =>
                                        handleCharacteristicChange(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />

                                {sharks.characteristics.length >
                                    1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeCharacteristic(
                                                index
                                            )
                                        }
                                    >
                                        Remove Characteristic
                                    </button>
                                )}
                            </div>
                        )
                    )}

                    <button
                        type="button"
                        onClick={addCharacteristic}
                    >
                        + Add Characteristic
                    </button>

                    <h2>Image</h2>

                    {sharks.imageUrl && (
                        <div className="form-group">
                            <label>Current Image</label>

                            <img
                                src={
                                    sharks.imageUrl.startsWith(
                                        "http"
                                    )
                                        ? sharks.imageUrl
                                        : `${import.meta.env.VITE_API_BASE_URL}${sharks.imageUrl}`
                                }
                                alt={sharks.name}
                                style={{
                                    width: "100%",
                                    maxHeight: "250px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Replace Image</label>

                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit">
                        Update Shark
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditShark;