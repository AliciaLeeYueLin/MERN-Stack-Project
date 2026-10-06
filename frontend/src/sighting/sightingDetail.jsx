import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./sighting.css"

function SightingDetail() {
    const [detail, setDetail] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getDetail = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/sighting/sighting/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setDetail(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load details.");
            }
        };

        getDetail();
    }, [navigate, id]);

    return (
        <div className="sighting-detail-container">
            <div>
                <h1>Details</h1>

                {error && <div className="error-message">{error}</div>}

                {detail && (
                    <div className="sighting-detail">
                        <h2>Shark: {detail.sharkId?.name}</h2>

                        <h3>Scientific Name: {detail.sharkId?.scientificName}</h3>

                        <h3>Location: {detail.locationId?.name}</h3>

                        <p>Country: {detail.locationId?.country}</p>

                        <p>Date: {new Date(detail.date).toLocaleDateString()}</p>

                        <p>Description: {detail.description}</p>

                        <div className="condition">
                            <div className="measurement">
                                <div className="measurement-header">
                                    <span>Water Depth</span>
                                    <strong>{detail.waterDepth} m</strong>
                                </div>

                                <div className="progress-line">
                                    <div className="progress-fill" style={{ width: `${Math.min((detail.waterDepth / 100) * 100, 100)}%` }}></div>
                                </div>

                                <div className="measurement-scale">
                                    <span>0 m</span>
                                    <span>100 m</span>
                                </div>
                            </div>

                            <div className="measurement">
                                <div className="measurement-header">
                                    <span>Water Temperature</span>
                                    <strong>{detail.waterTemperature} °C</strong>
                                </div>

                                <div className="progress-line">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${Math.min((detail.waterTemperature / 40) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>

                                <div className="measurement-scale">
                                    <span>0 °C</span>
                                    <span>40 °C</span>
                                </div>
                            </div>

                            <p>Weather: {detail.weatherCondition}</p>
                            <p>Visibility: {detail.visibility}</p>
                        </div>

                        <div className="shark-conditon">
                            <p>Shark Count: {detail.sharkCount}</p>

                            <p>Behavior: {detail.behavior}</p>

                            <p>Observer: {detail.observer}</p>

                            <p>Notes: {detail.notes}</p>
                        </div>
                    </div>
                )}

                <button onClick={() => navigate("/sighting")}>← Back</button>
            </div>
        </div>
    );
}

export default SightingDetail;
