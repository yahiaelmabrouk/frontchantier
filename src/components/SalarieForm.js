import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SalarieForm.css";

const SalarieForm = () => {
  const [form, setForm] = useState({ matricule: "", nom: "", tauxHoraire: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/salaries`, {
        ...form,
        tauxHoraire: Number(form.tauxHoraire),
      });
      navigate("/salaries");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salarie-form-modal">
      <form className="salarie-form" onSubmit={handleSubmit}>
        <h2>Ajouter un salarié</h2>
        <div className="form-group">
          <label>Matricule</label>
          <input
            type="text"
            name="matricule"
            value={form.matricule}
            onChange={handleChange}
            required
            className="form-input"
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Taux horaire</label>
          <input
            type="number"
            name="tauxHoraire"
            value={form.tauxHoraire}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-input"
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalarieForm;
