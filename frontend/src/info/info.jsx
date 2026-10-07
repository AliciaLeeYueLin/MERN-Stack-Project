import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./info.css";

function Info() {
    const [info, setInfo] = useState([]);
    const [error, setError] = useState("");
    const [isResearcher, setIsResearcher] = useState(false);

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

                if (response.data.role === "researcher") {
                    setIsResearcher(true);
                }
            } catch (error) {
                console.log("USER ERROR:", error);
            }
        };

        const getInfo = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/info/info`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("INFO DATA:", response.data);

                setInfo(response.data);
            } catch (error) {
                console.log("INFO ERROR:", error);

                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load info.");
            }
        };

        getUser();
        getInfo();
    }, [navigate]);

    const resizeGridItem = (item) => {
        const grid = document.querySelector(".info-grid");

        if (!grid) return;

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

    return (
        <div className="info-container">
            <div className="info-header">
                <h1>Info Area</h1>

            </div>

            {error && <div className="error-message">{error}</div>}

            {info.length === 0 && !error && <p>No information available.</p>}

            <div className="info-grid">
                {info.map((i) => (
                    <div className="content" key={i._id}>
                        <div className="info-card">
                            <div className="info-user">
                                <h2>Researcher: {i.userId?.name}</h2>
                            </div>

                            <h3>Shark: {i.sharkId?.name}</h3>

                            {i.imageUrl && <img src={i.imageUrl.startsWith("http") ? i.imageUrl : `${import.meta.env.VITE_API_BASE_URL}${i.imageUrl}`} alt={i.sharkId?.name} />}

                            <div className="info-content">
                                <h3>{i.title}</h3>

                                <p>{i.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Info;
