import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ChantierCard from "./ChantierCard";
import Popup from "./Popup";

const ChantierList = () => {
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    chantier: null,
  });
  const itemsPerPage = 6;

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchChantiers();
  }, []);

  const fetchChantiers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/chantiers`);
      setChantiers(response.data);
    } catch (error) {
      console.error("Error fetching chantiers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const chantier = chantiers.find((c) => c._id === id);
    setDeletePopup({
      isOpen: true,
      chantier: chantier,
    });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${API_URL}/api/chantiers/${deletePopup.chantier._id}`
      );
      setChantiers(
        chantiers.filter(
          (chantier) => chantier._id !== deletePopup.chantier._id
        )
      );
      setDeletePopup({ isOpen: false, chantier: null });
    } catch (error) {
      console.error("Error deleting chantier:", error);
      alert("Erreur lors de la suppression");
    }
  };

  const cancelDelete = () => {
    setDeletePopup({ isOpen: false, chantier: null });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChantiers = chantiers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(chantiers.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return <div className="loading">Chargement des chantiers...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestion des Chantiers</h1>
        <p className="page-subtitle">
          Gérez efficacement tous vos projets de construction
        </p>
      </div>

      <div className="header-actions">
        <Link to="/add" className="btn btn-primary">
          + Nouveau Chantier
        </Link>
      </div>

      {chantiers.length === 0 ? (
        <div className="empty-state">
          <h3>Aucun chantier trouvé</h3>
          <p>Commencez par ajouter votre premier chantier</p>
          <Link
            to="/add"
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Ajouter un Chantier
          </Link>
        </div>
      ) : (
        <>
          <div className="chantier-grid">
            {currentChantiers.map((chantier) => (
              <ChantierCard
                key={chantier._id}
                chantier={chantier}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <div className="pagination-info">
                Page {currentPage} sur {totalPages}
              </div>

              <button
                className="pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}

      <Popup
        isOpen={deletePopup.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        type="warning"
        showCancel={true}
      >
        <div className="delete-confirmation">
          <p>Êtes-vous sûr de vouloir supprimer ce chantier ?</p>
          {deletePopup.chantier && (
            <div className="chantier-name">
              "{deletePopup.chantier.nomChantier}"
            </div>
          )}
          <div className="warning-text">⚠️ Cette action est irréversible !</div>
        </div>
      </Popup>
    </div>
  );
};

export default ChantierList;
