import { Navigate, Outlet } from "react-router-dom";
import Navigation from "../pages/navbar";
import Footer from "../pages/footer";
import "../footer/footer.css";

const ProtectedRoute = () => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">
            <Navigation />

            <main className="main-content">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};
export default ProtectedRoute;