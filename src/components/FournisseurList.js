import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SalarieList.css";
import Popup from "./Popup";

const FournisseurList = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    fournisseur: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  const fetchFournisseurs = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/fournisseurs`)
      .then((res) => {
        setFournisseurs(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const handleDelete = (id) => {
    const fournisseur = fournisseurs.find((f) => f._id === id);
    setDeletePopup({ isOpen: true, fournisseur });
  };

  const confirmDelete = async () => {
    const id = deletePopup.fournisseur?._id;
    if (!id) return;
    setDeleteLoading(id);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/fournisseurs/${id}`
      );
      setFournisseurs((prev) => prev.filter((f) => f._id !== id));
      setDeletePopup({ isOpen: false, fournisseur: null });
    } catch (err) {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const cancelDelete = () => {
    setDeletePopup({ isOpen: false, fournisseur: null });
  };

  return (
    <div className="salarie-list-container">
      <h2 className="salarie-list-title">Liste des fournisseurs</h2>
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <Link to="/fournisseurs/add" className="btn btn-primary">
          + Ajouter Fournisseur
        </Link>
      </div>
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : fournisseurs.length === 0 ? (
        <div className="empty-state">Aucun fournisseur trouvé.</div>
      ) : (
        <div className="salarie-list-table-wrapper">
          <table className="salarie-list-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((f) => (
                <tr key={f._id}>
                  <td>{f.nom}</td>
                  <td>{f.budget} €</td>
                  <td>
                    <button
                      className="salarie-action-btn edit"
                      onClick={() => navigate(`/fournisseurs/edit/${f._id}`)}
                    >
                      Modifier
                    </button>
                    <button
                      className="salarie-action-btn delete"
                      onClick={() => handleDelete(f._id)}
                      disabled={deleteLoading === f._id}
                    >
                      {deleteLoading === f._id ? "Suppression..." : "Supprimer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Popup
        isOpen={deletePopup.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        type="warning"
        showCancel={true}
      >
        <div className="delete-salarie-confirmation">
          <p>Êtes-vous sûr de vouloir supprimer ce fournisseur ?</p>
          {deletePopup.fournisseur && (
            <div className="salarie-info-popup">
              <div>
                <span className="popup-label">Nom :</span>{" "}
                <span className="popup-value">
                  {deletePopup.fournisseur.nom}
                </span>
              </div>
              <div>
                <span className="popup-label">Budget :</span>{" "}
                <span className="popup-value">
                  {deletePopup.fournisseur.budget} €
                </span>
              </div>
            </div>
          )}
          <div className="popup-warning-text">
            ⚠️ Cette action est irréversible !
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default FournisseurList;
