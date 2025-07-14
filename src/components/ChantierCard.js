import React from "react";
import { Link } from "react-router-dom";

const ChantierCard = ({ chantier, onDelete, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div className="chantier-card">
      <div className="chantier-header">
        <h3 className="chantier-title">{chantier.nomChantier}</h3>
        <span
          className={
            chantier.etat === "fermé"
              ? "chantier-etat closed"
              : "chantier-etat active"
          }
        >
          {chantier.etat}
        </span>
      </div>

      <div className="chantier-details">
        <div className="detail-item">
          <span className="detail-label">N° Attachement:</span>
          <span className="detail-value">{chantier.numAttachement}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Client:</span>
          <span className="detail-value">{chantier.client}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Lieu:</span>
          <span className="detail-value">{chantier.lieuExecution}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Nature:</span>
          <span className="detail-value">{chantier.natureTravail}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Date création:</span>
          <span className="detail-value">
            {formatDate(chantier.dateCreation)}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/edit/${chantier._id}`} className="btn btn-edit">
          ✏️ Modifier
        </Link>
        <Link to={`/charges/${chantier._id}`} className="btn btn-charges">
          💰 Charges
        </Link>
        <button
          onClick={() => onDelete(chantier._id)}
          className="btn btn-delete"
        >
          🗑️ Supprimer
        </button>
        {chantier.etat !== "fermé" && (
          <button
            onClick={() => onClose(chantier._id)}
            className="btn btn-close"
          >
            Fermer le chantier
          </button>
        )}
      </div>
    </div>
  );
};

export default ChantierCard;
