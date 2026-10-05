import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./user.css"
import axios from "axios";

function Approve() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");
    const [showRejectConfirm, setShowRejectConfirm] = useState(null);

    const navigate = useNavigate();

    const handleApprove = async (id) => {
        const token = localStorage.getItem("jwt_token");

        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/admin/application/${id}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setApplications((oldApplications) => oldApplications.map((application) => (application._id === id ? { ...application, status: "approved" } : application)));
        } catch (error) {
            console.log(error.response?.data);
            setError(error.response?.data?.error || "Failed to approve application.");
        }
    };

    const handleReject = async (id) => {
        const token = localStorage.getItem("jwt_token");

        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/admin/application/${id}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            setApplications((oldApplications) => oldApplications.map((application) => (application._id === id ? { ...application, status: "rejected" } : application)));
        } catch (error) {
            setError("Failed to reject application.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getResearch = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/application`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setApplications(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load applications.");
            }
        };

        getResearch();
    }, [navigate]);

    return (
        <>
            {error && <p className="error">{error}</p>}

            {applications.map((application) => (
                <div className="application-grid">
                    <div className="application-card" key={application._id}>
                        <div className="application-header">
                            <h2>{application.userId?.name}</h2>
                            <p className="application-email">Email: {application.userId?.email}</p>
                        </div>

                        <span className={`status-badge ${application.status}`}>{application.status}</span>

                        <div className="application-details">
                            <p>Organization: {application.organization}</p>

                            <p>Research Field: {application.researchField}</p>

                            <p>Qualification: {application.qualification}</p>

                            <p>Experience: {application.experience}</p>

                            <p>Reason: {application.reason}</p>
                        </div>

                        <div className="application-actions">
                            {application.status === "pending" && (
                                <>
                                    <button className="approve-button" onClick={() => handleApprove(application._id)}>
                                        Approve
                                    </button>

                                    <button className="reject-button" onClick={() => setShowRejectConfirm(application._id)}>
                                        Reject
                                    </button>
                                </>
                            )}

                            {application.status === "approved" && (
                                <button className="approved-button" disabled>
                                    Approved
                                </button>
                            )}

                            {application.status === "rejected" && (
                                <button className="rejected-button" disabled>
                                    Rejected
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <Modal show={showRejectConfirm !== null} onHide={() => setShowRejectConfirm(null)} centered>
                <Modal.Header>
                    <Modal.Title>Confirm Rejection</Modal.Title>
                </Modal.Header>

                <Modal.Body>Are you sure you want to reject this application?</Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectConfirm(null)}>
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={() => {
                            handleReject(showRejectConfirm);
                            setShowRejectConfirm(null);
                        }}
                    >
                        Yes, Reject
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Approve;
