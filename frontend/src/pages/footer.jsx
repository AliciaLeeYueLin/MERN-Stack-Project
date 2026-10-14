import "../footer/footer.css";
import { FaGithub } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h3>🦈 Shark Research</h3>
                    <p>Explore shark species, sightings and habitats around the world.</p>
                </div>

                <div className="footer-section">
                    <h4>Explore</h4>
                    <a href="/sharks">Sharks</a>
                    <a href="/location">Locations</a>
                    <a href="/sighting">Sightings</a>
                </div>

                <div className="footer-section">
                    <h4>About Us</h4>
                    <a href="tel:0124786387">☎ 012-478 6387</a>
                    <a href="mailto:alicialleeyl@gmail.com">✉ alicialleeyl@gmail.com</a>
                    <a href="https://github.com/AliciaLeeYueLin" target="_blank" rel="noopener noreferrer">
                        <span className="footer-icon"><FaGithub /> GitHub</span>
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Shark Research. All rights reserved.</p>
                <p>🌊 Discover • Research • Protect</p>
            </div>
        </footer>
    );
}

export default Footer;
