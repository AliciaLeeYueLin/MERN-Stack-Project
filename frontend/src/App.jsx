import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import Shark from "./pages/shark";
import Location from "./pages/location";
import Info from "./info/info";
import Sighting from "./pages/sighting";
import ProtectedRoute from "./component/protectedRoutes";
import "./App.css";
import NewLocation from "./location/newLocation";
import NewShark from "./shark/newShark";
import EditShark from "./shark/editShark";
import Approve from "./user/approve";
import NewInfo from "./info/newInfo";
import SightingDetail from "./sighting/sightingDetail";
import NewSighting from "./sighting/newSighting";
import Footer from "./pages/footer";
import SharkDetail from "./shark/sharkDetails";
import InfoNavbar from "./pages/infoNavbar";
import Habitats from "./habitat/habitat";
import ScrollToTop from "./component/scrollToTop";

function App() {
    return (
        <BrowserRouter>
        <ScrollToTop/>
            <div className="app">
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/sharks" element={<Shark />} />
                            <Route path="/sharks/add" element={<NewShark />} />
                            <Route path="/sharks/edit/:id" element={<EditShark />} />
                            <Route path="/sharks/detail/:id" element={<SharkDetail />} />
                            <Route path="/habitat" element={<Habitats />} />
                            <Route path="/location" element={<Location />} />
                            <Route path="/location/add" element={<NewLocation />} />
                            <Route path="/request" element={<Approve />} />
                            <Route path="/info" element={<InfoNavbar />} />
                            <Route path="/info-edit" element={<InfoNavbar />} />
                            <Route path="/add-new-info" element={<InfoNavbar />} />
                            <Route path="/sighting" element={<Sighting />} />
                            <Route path="/sighting/add" element={<NewSighting />} />
                            <Route path="/sighting/detail/:id" element={<SightingDetail />} />
                        </Route>
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
