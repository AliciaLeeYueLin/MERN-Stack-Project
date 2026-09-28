import { Navigate, Outlet } from "react-router-dom";
import Navigation from "../pages/navbar";

const ProtectedRoute = () => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
};

export default ProtectedRoute;