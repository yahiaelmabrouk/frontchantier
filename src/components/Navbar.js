import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🏗️ Gestion Chantiers
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/chantiers">Mes Chantiers</Link>
          </li>
          <li>
            <Link to="/add">Ajouter Chantier</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
