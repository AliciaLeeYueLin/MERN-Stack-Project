import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Info from "../info/info";
import EditInfo from "../info/editInfo";
import NewInfo from "../info/newInfo";

function InfoNavbar() {
    const { pathname } = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const links = [
        { to: "/info", label: "Info" },
        { to: "/info-edit", label: "Edit Info" },
        { to: "/add-new-info", label: "Add New Info" },
    ];

    let page;

    if (pathname === "/info") {
        page = <Info />;
    } else if (pathname === "/info-edit") {
        page = <EditInfo />;
    } else if (pathname === "/add-new-info") {
        page = <NewInfo />;
    }

    return (
        <div className="info-layout">
            <button className="sidebar-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
            </button>

            <nav className={sidebarOpen ? "sidenav open" : "sidenav closed"}>
                <div className="sidenav-brand">Fun Fact Explorer</div>

                {links.map((link) => (
                    <Link key={link.to} to={link.to} className={pathname === link.to ? "active" : ""}>
                        {link.label}
                    </Link>
                ))}
            </nav>

            <main className="info-content">{page}</main>
        </div>
    );
}

export default InfoNavbar;
