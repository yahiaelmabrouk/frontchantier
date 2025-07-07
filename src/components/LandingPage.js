import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const features = [
    {
      icon: "🏗️",
      title: "Gestion Centralisée",
      description:
        "Gérez tous vos chantiers depuis une interface unique et intuitive",
    },
    {
      icon: "💰",
      title: "Suivi des Charges",
      description:
        "Contrôlez vos coûts avec un système de suivi détaillé des charges",
    },
    {
      icon: "📊",
      title: "Tableau de Bord",
      description:
        "Visualisez vos données avec des graphiques et des statistiques en temps réel",
    },
    {
      icon: "🔄",
      title: "Mise à Jour Temps Réel",
      description: "Synchronisation automatique de toutes vos données",
    },
    {
      icon: "📱",
      title: "Responsive Design",
      description: "Accédez à votre plateforme depuis n'importe quel appareil",
    },
    {
      icon: "🔒",
      title: "Sécurisé",
      description:
        "Vos données sont protégées avec les meilleurs standards de sécurité",
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Gérez vos <span className="highlight">Chantiers</span>
              <br />
              avec Efficacité
            </h1>
            <p className="hero-description">
              Une solution complète pour la gestion de vos projets de
              construction. Suivez vos chantiers, contrôlez vos charges et
              optimisez votre rentabilité.
            </p>
            <div className="hero-actions">
              <Link to="/chantiers" className="btn btn-primary btn-large">
                🚀 Commencer Maintenant
              </Link>
              <Link to="/add" className="btn btn-secondary btn-large">
                + Nouveau Chantier
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <h3>Chantier Villa Moderne</h3>
              </div>
              <div className="card-content">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "75%" }}></div>
                </div>
                <p>Progression: 75%</p>
                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-value">€125,000</span>
                    <span className="stat-label">Budget</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">45j</span>
                    <span className="stat-label">Restants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Pourquoi Choisir Notre Solution ?</h2>
          <p className="section-subtitle">
            Des outils puissants pour optimiser la gestion de vos chantiers
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
