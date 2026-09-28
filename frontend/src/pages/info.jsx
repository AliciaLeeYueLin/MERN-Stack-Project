import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditInfo from "../component/editInfo";
import { Modal } from "react-bootstrap";

function Info() {
    const [info, setInfo] = useState([]);
    const [error, setError] = useState("");
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isResearcher, setIsResearcher] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);

                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }

                if (response.data.role === "researcher") {
                    setIsResearcher(true);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getUser();

        const getInfo = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/info/info`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setInfo(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load info.");
            }
        };

        getInfo();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setSharks({
            ...sharks,
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
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/info/info/`, sharks, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Info added successfully.");

            setTimeout(() => {
                navigate("/info");
            }, 1000);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("jwt_token");
                navigate("/");
                return;
            }

            setError("Failed to add info.");
        }
    };

    const handleCancel = () => {
        navigate("/sharks");
    };

    const handleUpdated = (updatedInfo) => {
        setInfo((oldInfo) => oldInfo.map((i) => (i._id === updatedInfo._id ? updatedInfo : i)));
    };

   

    return (
        <div className="products-container">
            <div className="products-header">
                <h1>Shark</h1>
                <div className="btn">
                    {isResearcher && (
                        <button className="add" onClick={() => navigate(`/info/add/`)}>
                            +
                        </button>
                    )}

                   
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="shark-grid">
                {info.map((i) => (
                    <div className="shark-card" key={i._id}>
                        <h2>Researcher: {i.userId?.name}</h2>

                        <h2>Shark: {i.sharkId?.name}</h2>

                        {i.imageUrl && <img src={i.imageUrl} alt={i.sharkId?.name} />}

                        <div className="card-content">
                            <h2>{i.title}</h2>
                            <p>{i.description}</p>
                            {user?.role === "researcher" && i.userId?._id === user?._id && <button onClick={() => setSelectedInfo(i)}>Edit</button>}{" "}
                        </div>
                    </div>
                ))}
                {selectedInfo && <EditInfo info={selectedInfo} onUpdated={handleUpdated} onClose={() => setSelectedInfo(null)} />}
            </div>
        </div>
    );
}

export default Info;
