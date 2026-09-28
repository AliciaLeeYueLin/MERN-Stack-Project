import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home"
import Shark from "./pages/shark";
import Location from "./pages/location";
import Info from "./pages/info"
import ProtectedRoute from "./component/protectedRoutes";
import "./App.css";
import NewLocation from "./component/newLocation";
import NewShark from "./component/newShark"
import EditShark from "./component/editShark";
import Approve from "./component/approve"
import NewInfo from "./component/newInfo"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/sharks" element={<Shark />} />
                    <Route path="/sharks/add" element={<NewShark />} />
                    <Route path="/sharks/edit/:id" element={<EditShark />} />
                    <Route path="/location" element={<Location />} />
                    <Route path="/location/add" element={<NewLocation/>} />
                    <Route path="/request" element={<Approve/>} />
                    <Route path="/info" element={<Info/>} />
                    <Route path="/info/add" element={<NewInfo/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
