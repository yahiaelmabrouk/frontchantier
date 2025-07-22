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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("actifs");
  const [dateStart, setDateStart] = useState(""); // Start date filter
  const [dateEnd, setDateEnd] = useState(""); // End date filter
  const [invoicePopup, setInvoicePopup] = useState({
    isOpen: false,
    chantier: null,
  });
  const itemsPerPage = 9;

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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCloseChantier = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/chantiers/${id}/close`);
      setChantiers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, etat: "fermé" } : c))
      );
    } catch (error) {
      alert("Erreur lors de la fermeture du chantier.");
    }
  };

  // Add handler for invoice button
  const handleInvoiceClick = (chantier) => {
    setInvoicePopup({
      isOpen: true,
      chantier,
    });
  };

  const closeInvoicePopup = () => {
    setInvoicePopup({ isOpen: false, chantier: null });
  };

  // Filter and search logic
  const filteredChantiers = chantiers.filter((c) => {
    const matchesSearch = c.nomChantier
      .toLowerCase()
      .includes(search.toLowerCase());
    if (filter === "actifs") {
      return c.etat !== "fermé" && matchesSearch;
    }
    return matchesSearch;
  });

  // Filter chantiers by date range
  const dateFilteredChantiers =
    dateStart || dateEnd
      ? filteredChantiers.filter((chantier) => {
          if (!chantier.dateCreation) return false;
          const chantierDate = new Date(chantier.dateCreation).setHours(
            0,
            0,
            0,
            0
          );
          let afterStart = true,
            beforeEnd = true;
          if (dateStart) {
            afterStart =
              chantierDate >= new Date(dateStart).setHours(0, 0, 0, 0);
          }
          if (dateEnd) {
            beforeEnd = chantierDate <= new Date(dateEnd).setHours(0, 0, 0, 0);
          }
          return afterStart && beforeEnd;
        })
      : filteredChantiers;

  // Pagination for active chantiers
  const activeChantiers = dateFilteredChantiers.filter(
    (c) => c.etat !== "fermé"
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActiveChantiers = activeChantiers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(activeChantiers.length / itemsPerPage);

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

      <div className="chantier-controls">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={handleSearchChange}
          className="chantier-search-input"
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="chantier-filter-select"
        >
          <option value="actifs">Chantiers actifs</option>
          <option value="tous">Tous les chantiers</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="chantier-controls">
        <label
          htmlFor="date-start"
          style={{ fontWeight: 500, color: "#667eea" }}
        >
          Filtrer du :
        </label>
        <input
          id="date-start"
          type="date"
          className="chantier-filter-select"
          value={dateStart}
          onChange={(e) => {
            setDateStart(e.target.value);
            setCurrentPage(1);
          }}
          style={{ minWidth: 0, width: "auto" }}
        />
        <label htmlFor="date-end" style={{ fontWeight: 500, color: "#667eea" }}>
          au :
        </label>
        <input
          id="date-end"
          type="date"
          className="chantier-filter-select"
          value={dateEnd}
          onChange={(e) => {
            setDateEnd(e.target.value);
            setCurrentPage(1);
          }}
          style={{ minWidth: 0, width: "auto" }}
        />
      </div>

      {dateFilteredChantiers.length === 0 ? (
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
      ) : filter === "tous" ? (
        <div className="chantier-table-wrapper">
          <table className="chantier-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>N° Attachement</th>
                <th>Client</th>
                <th>Lieu</th>
                <th>Nature</th>
                <th>Date création</th>
                <th>État</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dateFilteredChantiers.map((chantier) => (
                <tr key={chantier._id}>
                  <td>{chantier.nomChantier}</td>
                  <td>{chantier.numAttachement}</td>
                  <td>{chantier.client}</td>
                  <td>{chantier.lieuExecution}</td>
                  <td>{chantier.natureTravail}</td>
                  <td>
                    {new Date(chantier.dateCreation).toLocaleDateString(
                      "fr-FR"
                    )}
                  </td>
                  <td>
                    <span
                      className={
                        chantier.etat === "fermé"
                          ? "chantier-etat closed"
                          : "chantier-etat active"
                      }
                    >
                      {chantier.etat}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/edit/${chantier._id}`}
                      className="btn btn-edit btn-sm"
                    >
                      ✏️
                    </Link>
                    <Link
                      to={`/charges/${chantier._id}`}
                      className="btn btn-charges btn-sm"
                    >
                      💰
                    </Link>
                    <button
                      onClick={() => handleDelete(chantier._id)}
                      className="btn btn-delete btn-sm"
                    >
                      🗑️
                    </button>
                    {chantier.etat === "fermé" && (
                      <button
                        className="btn btn-sm btn-invoice"
                        onClick={() => handleInvoiceClick(chantier)}
                      >
                        🧾 Générer Facture
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="chantier-grid">
            {currentActiveChantiers.map((chantier) => (
              <ChantierCard
                key={chantier._id}
                chantier={chantier}
                onDelete={handleDelete}
                onClose={handleCloseChantier}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Précédent
              </button>

              <div className="pagination-info">
                Page {currentPage} sur {totalPages}
              </div>

              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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

      <Popup
        isOpen={invoicePopup.isOpen}
        onClose={closeInvoicePopup}
        title="Génération de facture"
        type="info"
      >
        <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
          <p style={{ fontSize: "1.15rem", color: "#667eea", fontWeight: 500 }}>
            Travail en cours...
            <br />
            La génération de facture sera bientôt disponible.
          </p>
        </div>
      </Popup>
    </div>
  );
};

export default ChantierList;
