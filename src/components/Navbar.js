import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🏗️ Gestion Chantiers
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className="navbar-link">
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/chantiers" className="navbar-link">
              Mes Chantiers
            </Link>
          </li>
          <li>
            <Link to="/add" className="navbar-link">
              Ajouter Chantier
            </Link>
          </li>
          <li>
            <Link to="/salaries/add" className="navbar-link">
              Ajouter Salarié
            </Link>
          </li>
          <li>
            <Link to="/salaries" className="navbar-link">
              Tous les salariés
            </Link>
          </li>
          <li>
            <Link to="/fournisseurs/add" className="navbar-link">
              Ajouter Fournisseur
            </Link>
          </li>
          <li>
            <Link to="/fournisseurs" className="navbar-link">
              Tous les fournisseurs
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
