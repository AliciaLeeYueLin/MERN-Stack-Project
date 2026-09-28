import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Approve() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");

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
                }
            );

            setApplications((oldApplications) =>
                oldApplications.map((application) =>
                    application._id === id
                        ? { ...application, status: "approved" }
                        : application
                )
            );
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
                }
            );

            setApplications((oldApplications) =>
                oldApplications.map((application) =>
                    application._id === id
                        ? { ...application, status: "rejected" }
                        : application
                )
            );
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
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/application`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setApplications(response.data);
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

                setError("Failed to load applications.");
            }
        };

        getResearch();
    }, [navigate]);

    return (
        <>
            {error && <p className="error">{error}</p>}

            {applications.map((application) => (
                <div key={application._id}>
                    <h2>
                        {application.userId?.name}
                    </h2>

                    <p>
                        Email: {application.userId?.email}
                    </p>

                    <p>
                        Organization: {application.organization}
                    </p>

                    <p>
                        Research Field: {application.researchField}
                    </p>

                    <p>
                        Qualification: {application.qualification}
                    </p>

                    <p>
                        Experience: {application.experience}
                    </p>

                    <p>
                        Reason: {application.reason}
                    </p>

                    <p>
                        Status: {application.status}
                    </p>

                    {application.status === "pending" && (
                        <>
                            <button
                                className="approve-button"
                                onClick={() =>
                                    handleApprove(application._id)
                                }
                            >
                                Approve
                            </button>

                            <button
                                className="reject-button"
                                onClick={() =>
                                    handleReject(application._id)
                                }
                            >
                                Reject
                            </button>
                        </>
                    )}

                    {application.status === "approved" && (
                        <button
                            className="approved-button"
                            disabled
                        >
                            Approved
                        </button>
                    )}

                    {application.status === "rejected" && (
                        <button
                            className="rejected-button"
                            disabled
                        >
                            Rejected
                        </button>
                    )}
                </div>
            ))}
        </>
    );
}

export default Approve;