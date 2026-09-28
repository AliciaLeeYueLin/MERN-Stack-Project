import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResearcherForm({ handleCancel }) {
    const [form, setForm] = useState({
        name: "",
        organization: "",
        researchField: "",
        qualification: "",
        experience: "",
        reason: "",
        status: "pending",
    });
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [user, setUser] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleApply = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/research/request`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Request submitted successfully!");
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to submit request.");
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load locations.");
            }
        };

        getUsers();
    }, [navigate]);

    return (
        <>
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleApply} className="researcher-apply-form">
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={user?.name || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Organization</label>
                    <input type="text" name="organization" value={form.organization} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <input type="text" name="researchField" value={form.researchField} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Qualification</label>
                    <input type="text" name="qualification" value={form.qualification} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Experience</label>
                    <input type="text" name="experience" value={form.experience} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Reason</label>
                    <input type="text" name="reason" value={form.reason} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Status</label>
                    <input type="text" name="status" value={form.status} onChange={handleChange} />
                </div>

                <div className="button-group">
                    <button type="submit" className="add-button">
                        Submit Form
                    </button>

                    <button type="button" onClick={handleCancel} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}

export default ResearcherForm;
