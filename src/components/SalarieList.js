import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SalarieList.css";
import Popup from "./Popup";

const initialEditState = { _id: "", matricule: "", nom: "", tauxHoraire: "" };

const SalarieList = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSalarie, setEditSalarie] = useState(initialEditState);
  const [showEdit, setShowEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    salarie: null,
  });

  const fetchSalaries = () => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/api/salaries`).then((res) => {
      setSalaries(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleDelete = (id) => {
    const salarie = salaries.find((s) => s._id === id);
    setDeletePopup({
      isOpen: true,
      salarie,
    });
  };

  const confirmDelete = async () => {
    const id = deletePopup.salarie?._id;
    if (!id) return;
    setDeleteLoading(id);
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/salaries/${id}`);
      setSalaries((prev) => prev.filter((s) => s._id !== id));
      setDeletePopup({ isOpen: false, salarie: null });
    } catch (err) {
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const cancelDelete = () => {
    setDeletePopup({ isOpen: false, salarie: null });
  };

  const handleEditClick = (salarie) => {
    setEditSalarie({ ...salarie });
    setShowEdit(true);
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditSalarie({ ...editSalarie, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/salaries/${editSalarie._id}`,
        {
          matricule: editSalarie.matricule,
          nom: editSalarie.nom,
          tauxHoraire: Number(editSalarie.tauxHoraire),
        }
      );
      setShowEdit(false);
      fetchSalaries();
    } catch (err) {
      setEditError(
        err.response?.data?.error || "Erreur lors de la modification."
      );
    }
  };

  return (
    <div className="salarie-list-container">
      <h2 className="salarie-list-title">Liste des salariés</h2>
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : salaries.length === 0 ? (
        <div className="empty-state">Aucun salarié trouvé.</div>
      ) : (
        <div className="salarie-list-table-wrapper">
          <table className="salarie-list-table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Taux horaire</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((s) => (
                <tr key={s._id}>
                  <td>{s.matricule}</td>
                  <td>{s.nom}</td>
                  <td>{s.tauxHoraire} €</td>
                  <td>
                    <button
                      className="salarie-action-btn edit"
                      onClick={() => handleEditClick(s)}
                    >
                      Modifier
                    </button>
                    <button
                      className="salarie-action-btn delete"
                      onClick={() => handleDelete(s._id)}
                      disabled={deleteLoading === s._id}
                    >
                      {deleteLoading === s._id ? "Suppression..." : "Supprimer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEdit && (
        <div className="salarie-edit-modal">
          <form className="salarie-edit-form" onSubmit={handleEditSubmit}>
            <h3>Modifier salarié</h3>
            <div className="form-group">
              <label>Matricule</label>
              <input
                type="text"
                name="matricule"
                value={editSalarie.matricule}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                name="nom"
                value={editSalarie.nom}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Taux horaire</label>
              <input
                type="number"
                name="tauxHoraire"
                value={editSalarie.tauxHoraire}
                onChange={handleEditChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            {editError && <div className="form-error">{editError}</div>}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => setShowEdit(false)}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
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
          <p>Êtes-vous sûr de vouloir supprimer ce salarié ?</p>
          {deletePopup.salarie && (
            <div className="salarie-info-popup">
              <div>
                <span className="popup-label">Matricule :</span>{" "}
                <span className="popup-value">
                  {deletePopup.salarie.matricule}
                </span>
              </div>
              <div>
                <span className="popup-label">Nom :</span>{" "}
                <span className="popup-value">{deletePopup.salarie.nom}</span>
              </div>
              <div>
                <span className="popup-label">Taux horaire :</span>{" "}
                <span className="popup-value">
                  {deletePopup.salarie.tauxHoraire} €
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

export default SalarieList;
