function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-brand">
                    <h3>🦈 Shark Research</h3>
                    <p>
                        Explore shark species, sightings and habitats
                        around the world.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Explore</h4>
                    <a href="/sharks">Sharks</a>
                    <a href="/location">Locations</a>
                    <a href="/sightings">Sightings</a>
                </div>

                <div className="footer-section">
                    <h4>About</h4>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
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


