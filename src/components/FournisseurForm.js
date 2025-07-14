import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "./Popup";
import "./SalarieForm.css";

const API_URL = process.env.REACT_APP_API_URL;

const FournisseurForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({ nom: "", budget: "" });
  const [oldData, setOldData] = useState({ nom: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    content: null,
    type: "success",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      fetchFournisseur();
    }
  }, [id, isEditing]);

  const fetchFournisseur = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/fournisseurs/${id}`);
      if (!res.ok) throw new Error("Erreur lors du chargement.");
      const data = await res.json();
      setOldData({ nom: data.nom, budget: data.budget });
    } catch (err) {
      setError("Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Use old value if field is empty
    const payload = {
      nom: formData.nom.trim() !== "" ? formData.nom : oldData.nom,
      budget: formData.budget.trim() !== "" ? formData.budget : oldData.budget,
    };

    try {
      let res;
      if (isEditing) {
        res = await fetch(`${API_URL}/api/fournisseurs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_URL}/api/fournisseurs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const data = await res.json();
        // Only show error if not editing
        if (!isEditing)
          throw new Error(data.error || "Erreur lors de la sauvegarde.");
      }
      setPopup({
        isOpen: true,
        title: isEditing ? "Fournisseur modifié" : "Fournisseur ajouté",
        content: (
          <div>
            <p>
              {isEditing
                ? "Le fournisseur a été modifié avec succès."
                : "Le fournisseur a été ajouté avec succès."}
            </p>
          </div>
        ),
        type: "success",
      });
    } catch (err) {
      if (!isEditing) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
    navigate("/fournisseurs");
  };

  if (loading && isEditing && !oldData.nom) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="salarie-form-modal">
      <form className="salarie-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? "Modifier Fournisseur" : "Ajouter un fournisseur"}</h2>
        <div className="form-group">
          <label className="form-label">
            Nom
            {isEditing && oldData.nom && (
              <span style={{ color: "#888", fontWeight: 400, marginLeft: 8 }}>
                (actuel: {oldData.nom})
              </span>
            )}
          </label>
          <input
            type="text"
            name="nom"
            className="form-input"
            value={formData.nom}
            onChange={handleChange}
            placeholder={
              isEditing && oldData.nom ? oldData.nom : "Nom du fournisseur"
            }
            autoComplete="off"
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            Budget
            {isEditing && oldData.budget !== undefined && (
              <span style={{ color: "#888", fontWeight: 400, marginLeft: 8 }}>
                (actuel: {oldData.budget})
              </span>
            )}
          </label>
          <input
            type="number"
            name="budget"
            className="form-input"
            value={formData.budget}
            onChange={handleChange}
            placeholder={
              isEditing && oldData.budget !== undefined
                ? oldData.budget
                : "Budget"
            }
            min="0"
            step="0.01"
            autoComplete="off"
            required
          />
        </div>
        {error && !isEditing && (
          <div
            style={{
              color: "#dc3545",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/fournisseurs")}
            className="btn btn-secondary"
            disabled={loading}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Sauvegarde..." : isEditing ? "Modifier" : "Ajouter"}
          </button>
        </div>
      </form>
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        type={popup.type}
      >
        {popup.content}
      </Popup>
    </div>
  );
};

export default FournisseurForm;
