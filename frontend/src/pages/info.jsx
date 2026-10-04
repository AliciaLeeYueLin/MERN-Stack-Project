import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditInfo from "../info/editInfo";

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

    const handleCancel = () => {
        navigate("/sharks");
    };

    const handleUpdated = (updatedInfo) => {
        setInfo((oldInfo) => oldInfo.map((i) => (i._id === updatedInfo._id ? updatedInfo : i)));
    };

    const resizeGridItem = (item) => {
        const grid = document.querySelector(".info-grid");

        const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"));

        const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("gap"));

        const content = item.querySelector(".info-card");

        if (!content) return;

        const rowSpan = Math.ceil((content.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));

        item.style.gridRowEnd = `span ${rowSpan}`;
    };

    const resizeAllGridItems = () => {
        const allItems = document.querySelectorAll(".info-grid .content");

        allItems.forEach((item) => {
            resizeGridItem(item);
        });
    };

    useEffect(() => {
        if (info.length === 0) return;

        resizeAllGridItems();

        const images = document.querySelectorAll(".info-grid img");

        images.forEach((image) => {
            image.addEventListener("load", resizeAllGridItems);
        });

        window.addEventListener("resize", resizeAllGridItems);

        return () => {
            window.removeEventListener("resize", resizeAllGridItems);

            images.forEach((image) => {
                image.removeEventListener("load", resizeAllGridItems);
            });
        };
    }, [info]);

    const handleDeleted = (infoId) => {
    setInfo((oldInfo) =>
        oldInfo.filter((i) => i._id !== infoId)
    );
};

    return (
        <div className="info-container">
            <div className="info-header">
                <h1>Info Area</h1>
                {isResearcher && (
                    <button className="add-info" onClick={() => navigate(`/info/add/`)}>
                        +
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="info-grid">
                {info.map((i) => (
                    <div className="content" key={i._id}>
                        <div className="info-card">
                            <div className="info-user">
                                <h2>Researcher: {i.userId?.name}</h2>
                            </div>

                            <h3>Shark: {i.sharkId?.name}</h3>

                            {i.imageUrl && <img src={`${import.meta.env.VITE_API_BASE_URL}${i.imageUrl}`} alt={i.sharkId?.name} />}

                            <div className="info-content">
                                <h3>{i.title}</h3>

                                <p>{i.description}</p>

                                {user?.role === "researcher" && i.userId?._id === user?._id && <button onClick={() => setSelectedInfo(i)}>Edit</button>}
                            </div>
                        </div>
                    </div>
                ))}

                {selectedInfo && <EditInfo info={selectedInfo} onUpdated={handleUpdated} onDeleted={handleDeleted} onClose={() => setSelectedInfo(null)} />}
            </div>
        </div>
    );
}

export default Info;
