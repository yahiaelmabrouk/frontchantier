import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => setNavOpen((open) => !open);
  const closeMenu = () => setNavOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span role="img" aria-label="chantier">
            🏗️
          </span>
          <span className="brand-text">Gestion Chantiers</span>
        </Link>
        <button
          className={`navbar-toggle${navOpen ? " open" : ""}`}
          onClick={handleToggle}
          aria-label="Menu"
          aria-expanded={navOpen}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
        <ul className={`navbar-nav${navOpen ? " show" : ""}`}>
          <li>
            <Link
              to="/"
              className={`navbar-link${
                location.pathname === "/" ? " active" : ""
              }`}
              onClick={closeMenu}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/chantiers"
              className={`navbar-link${
                location.pathname.startsWith("/chantiers") ? " active" : ""
              }`}
              onClick={closeMenu}
            >
              Mes Chantiers
            </Link>
          </li>
          <li>
            <Link
              to="/add"
              className={`navbar-link${
                location.pathname === "/add" ? " active" : ""
              }`}
              onClick={closeMenu}
            >
              Ajouter Chantier
            </Link>
          </li>
          <li>
            <Link
              to="/salaries/add"
              className={`navbar-link${
                location.pathname === "/salaries/add" ? " active" : ""
              }`}
              onClick={closeMenu}
            >
              Ajouter Salarié
            </Link>
          </li>
          <li>
            <Link
              to="/salaries"
              className={`navbar-link${
                location.pathname === "/salaries" ? " active" : ""
              }`}
              onClick={closeMenu}
            >
              Tous les salariés
            </Link>
          </li>
          <li>
            <Link
              to="/fournisseurs/add"
              className={`navbar-link${
                location.pathname === "/fournisseurs/add" ? " active" : ""
              }`}
              onClick={closeMenu}
            >
              Ajouter Fournisseur
            </Link>
          </li>
          <li>
            <Link
              to="/fournisseurs"
              className={`navbar-link${
                location.pathname === "/fournisseurs" ? " active" : ""
              }`}
              onClick={closeMenu}
            >
              Tous les fournisseurs
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
