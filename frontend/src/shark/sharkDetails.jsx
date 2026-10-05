import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import "./shark.css"


function SharkDetail() {
    const [detail, setDetail] = useState({});
    const [error, setError] = useState("");
    const [selectedStage, setSelectedStage] = useState(0);
    const [openChar, setOpenChar] = useState(false);

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
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shark/sharks/${id}`, {
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

    const handleCancel = () => {
        navigate("/sharks");
    };

    const openCharacteristic = () => {
        setOpenChar(true);
    };
    return (
        <div className="shark-detail-page">
            <div className="shark-detail-card">
                <h2 className="shark-name">{detail.name}</h2>

                <h3 className="scientific-name">{detail.scientificName}</h3>

                <div className="detail-section">
                    <h3>Diet</h3>
                    <p className="detail-label">{detail.diet}</p>
                    <p>{detail.dietDetails}</p>
                </div>

                <div className="detail-section">
                    <h3>Habitat</h3>
                    <p className="detail-label">{detail.habitat}</p>
                    <p>{detail.habitatDetails}</p>
                </div>

                <div className="detail-section">
                    <h3>Reproduction</h3>

                    <div className="reproduction-grid">
                        <div>
                            <strong>Maturity Age</strong>
                            <p>{detail.reproduction?.maturityAge}</p>
                        </div>

                        <div>
                            <strong>Gestation Period</strong>
                            <p>{detail.reproduction?.gestationPeriod}</p>
                        </div>

                        <div>
                            <strong>Offspring Count</strong>
                            <p>{detail.reproduction?.offspringCount}</p>
                        </div>

                        <div>
                            <strong>Birth Size</strong>
                            <p>{detail.reproduction?.birthSize}</p>
                        </div>
                    </div>

                    <p>{detail.reproduction?.details}</p>
                </div>

                <div className="detail-section">
                    <h3>Life Cycle</h3>

                    <div className="lifecycle-buttons">
                        {detail.lifeCycle?.map((stage, index) => (
                            <Button className="lifecycle-button" key={index} variant={selectedStage === index ? "primary" : "outline-primary"} onClick={() => setSelectedStage(index)}>
                                {stage.stage}
                            </Button>
                        ))}
                    </div>

                    {detail.lifeCycle?.[selectedStage] && (
                        <div className="lifecycle-content">
                            <h4>{detail.lifeCycle[selectedStage].stage}</h4>

                            <p>{detail.lifeCycle[selectedStage].description}</p>

                            <span>{detail.lifeCycle[selectedStage].approximateDuration}</span>
                        </div>
                    )}
                </div>

                <Button variant="outline-primary" onClick={() => setOpenChar(!openChar)}>
                    {openChar ? "Hide Characteristics" : "Show Characteristics"}
                </Button>

                {openChar && (
                    <div className="detail-section">
                        <h3>Shark Characteristics</h3>

                        <div className="characteristics-grid">
                            {detail.characteristics?.map((item, index) => (
                                <div className="characteristic-card" key={index}>
                                    <h4>{item.characteristic}</h4>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div>
                    <button className="shark-detail-edit" onClick={handleCancel}>
                        Back to Shark
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SharkDetail;
