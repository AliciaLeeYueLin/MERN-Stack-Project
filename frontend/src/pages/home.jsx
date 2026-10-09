import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import tigerShark from "../assets/tigerShark.webp";
import bullSharks from "../assets/bullSharks.avif";
import exampleImage1 from "../assets/exampleImage1.jpg";
import exampleImage2 from "../assets/exampleImage2.jpg";
import exampleImage3 from "../assets/exampleImage3.webp";
import exampleImage4 from "../assets/exampleImage4.jpg";
import "../home/home.css"
function Home() {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState("");
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [locations, setLocations] = useState([]);
    const [frequencies, setFrequencies] = useState([]);

    const navigate = useNavigate();

    const sharkIcon = L.divIcon({
        html: `
        <div style="
            font-size: 60px;
            width: 65px;
            height: 65px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            🦈
        </div>
    `,
        className: "",
        iconSize: [65, 65],
        iconAnchor: [32, 32],
    });

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");

        if (!token || token.trim() === "") {
            localStorage.removeItem("jwt_token");
            navigate("/");
            return;
        }

        const getUsers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.role === "admin") {
                    setIsAdmin(true);
                }
                if (response.data.role === "user") {
                    setIsUser(true);
                }

                setUsers(response.data);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem("jwt_token");
                    navigate("/");
                    return;
                }

                setError("Failed to load locations.");
            }
        };

        getUsers();
    }, [navigate]);

    useEffect(() => {
        const getLocations = async () => {
            const token = localStorage.getItem("jwt_token");

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/location/locations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Location data:", response.data);

                setLocations(response.data);
            } catch (error) {
                console.log("Location error:", error);
            }
        };

        getLocations();
    }, []);

    useEffect(() => {
        const getFrequency = async () => {
            const token = localStorage.getItem("jwt_token");

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/sighting/frequency`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFrequencies(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        getFrequency();
    }, []);

    const openInfo = async () => {
        setShowUserInfo(true);
    };

    const handleClose = () => {
        setShowUserInfo(false);
    };

    console.log("locations:", locations);
    return (
        <>
            <div className="home-page">
                <section className="home-hero">
                    <h1>About Sharks</h1>

                    <p>
                        Sharks are much more than dangerous predators. They are highly adapted marine animals with unique bodies, powerful senses, different ways of reproducing, and an important role in ocean ecosystems. From the tiny dwarf lanternshark to the enormous whale shark, there are more
                        than 500 species, each adapted to its own environment.
                    </p>
                </section>

                <section className="map-section">
                    <h2>Shark Locations</h2>

                    <p>Explore some of the locations where different shark species have been recorded in this app.</p>

                    <div className="map-container">
                        <MapContainer
                            center={[4.2105, 101.9758]}
                            zoom={3}
                            minZoom={3}
                            maxZoom={3}
                            maxBounds={[
                                [-90, -180],
                                [90, 180],
                            ]}
                            maxBoundsViscosity={2.0}
                            scrollWheelZoom={false}
                            zoomControl={false}
                            doubleClickZoom={false}
                            touchZoom={false}
                            style={{
                                height: "500px",
                                width: "600px",
                            }}
                        >
                            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />

                            {locations.map((location) => (
                                <Marker key={location._id} position={[location.latitude, location.longitude]} icon={sharkIcon}>
                                    <Popup>
                                        <h3>{location.name}</h3>

                                        <p>{location.country}</p>

                                        <h4>Top Sharks</h4>

                                        {frequencies
                                            .filter((item) => item.locationId === location._id)
                                            .sort((a, b) => b.frequency - a.frequency)
                                            .slice(0, 3)
                                            .map((item, index) => (
                                                <div key={item.sharkId}>
                                                    {index + 1}. {item.sharkName} — {item.frequency}
                                                </div>
                                            ))}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </section>

                <section className="shark-section">
                    <h2>Sharks in the Ocean</h2>

                    <p className="section-intro">Although some sharks are apex predators, many species are harmless to humans and play an important role in keeping marine ecosystems balanced.</p>

                    <div className="photo-grid">
                        <div className="photo">
                            <img src={tigerShark} alt="Tiger Shark" />
                            <h3>Tiger Shark</h3>
                            <h5>Galeocerdo cuvier</h5>

                            <p>&copy; National Marine Sanctuary Foundation</p>
                            <p>Photo by N. Hammerschlag, courtesy of Oregon State University</p>
                        </div>

                        <div className="photo">
                            <img src={bullSharks} alt="Bull Shark" />
                            <h3>Bull Shark</h3>
                            <h5>Carcharhinus leucas</h5>

                            <p>&copy; Earth.com News</p>
                            <p>Photo by BySanjana Gajbhiye Editor</p>
                        </div>
                    </div>
                    <p className="section-outro">many species are harmless to humans and play an important role in keeping marine ecosystems balanced. </p>
                </section>

                <section className="threat-section">
                    <hr />
                    <br />
                    <h3>However, sharks are facing serious threats from human activities, especially overfishing and shark finning.</h3>
                    <div className="image-collage">
                        <div className="collage-image image1">
                            <img src={exampleImage1} alt="" />
                            <p>&copy; Wild View - Wildlife Conservation Society</p>
                        </div>

                        <div className="collage-image image2">
                            <img src={exampleImage2} alt="" />
                            <p>&copy; WordPress.com</p>
                        </div>

                        <div className="collage-image image3">
                            <img src={exampleImage3} alt="" />
                            <p>&copy; ResearchGate</p>
                        </div>

                        <div className="collage-image image4">
                            <img src={exampleImage4} alt="" />
                            <p>&copy; LinkedIn</p>
                        </div>
                    </div>
                </section>
             
               
            </div>
        </>
    );
}

export default Home;
