import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Popup from "./Popup";

const ChantierForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    numAttachement: "",
    client: "",
    lieuExecution: "",
    natureTravail: "",
    nomChantier: "",
    dateCreation: new Date().toISOString().split("T")[0],
    etat: "en cours",
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    title: "",
    content: null,
    type: "success",
  });

  useEffect(() => {
    if (isEditing) {
      fetchChantier();
    }
  }, [id, isEditing]);

  const fetchChantier = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/chantiers/${id}`);
      const chantier = response.data;
      setFormData({
        ...chantier,
        dateCreation: new Date(chantier.dateCreation)
          .toISOString()
          .split("T")[0],
        etat: chantier.etat || "en cours",
      });
    } catch (error) {
      console.error("Error fetching chantier:", error);
      alert("Erreur lors du chargement du chantier");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditing) {
        await axios.put(`${API_URL}/api/chantiers/${id}`, formData);
        setPopup({
          isOpen: true,
          title: "Chantier Modifié",
          content: (
            <div className="popup-chantier-details">
              <p>
                <strong>Le chantier a été modifié avec succès !</strong>
              </p>
              <div className="chantier-info">
                <p>
                  <span className="info-label">Nom du chantier:</span>{" "}
                  {formData.nomChantier}
                </p>
                <p>
                  <span className="info-label">N° Attachement:</span>{" "}
                  {formData.numAttachement}
                </p>
                <p>
                  <span className="info-label">Client:</span> {formData.client}
                </p>
                <p>
                  <span className="info-label">Lieu d'exécution:</span>{" "}
                  {formData.lieuExecution}
                </p>
                <p>
                  <span className="info-label">Nature du travail:</span>{" "}
                  {formData.natureTravail}
                </p>
              </div>
            </div>
          ),
          type: "success",
        });
      } else {
        await axios.post(`${API_URL}/api/chantiers`, formData);
        setPopup({
          isOpen: true,
          title: "Chantier Ajouté",
          content: (
            <div className="popup-chantier-details">
              <p>
                <strong>
                  Chantier: {formData.nomChantier} ajouté avec succès !
                </strong>
              </p>
              <div className="chantier-info">
                <p>
                  <span className="info-label">N° Attachement:</span>{" "}
                  {formData.numAttachement}
                </p>
                <p>
                  <span className="info-label">Client:</span> {formData.client}
                </p>
                <p>
                  <span className="info-label">Lieu d'exécution:</span>{" "}
                  {formData.lieuExecution}
                </p>
                <p>
                  <span className="info-label">Nature du travail:</span>{" "}
                  {formData.natureTravail}
                </p>
                <p>
                  <span className="info-label">Date de création:</span>{" "}
                  {new Date(formData.dateCreation).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          ),
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error saving chantier:", error);
      setPopup({
        isOpen: true,
        title: "Erreur",
        content: (
          <div className="popup-error">
            <p>
              {error.response?.data?.message || "Erreur lors de la sauvegarde"}
            </p>
          </div>
        ),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
    if (popup.type === "success") {
      navigate("/chantiers");
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="form-container">
      <h2 className="form-title">
        {isEditing ? "Modifier le Chantier" : "Nouveau Chantier"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Numéro d'Attachement *</label>
          <input
            type="text"
            name="numAttachement"
            value={formData.numAttachement}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Ex: ATT-2024-001"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Client *</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Nom du client"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Lieu d'Exécution *</label>
          <input
            type="text"
            name="lieuExecution"
            value={formData.lieuExecution}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Adresse du chantier"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nature du Travail *</label>
          <input
            type="text"
            name="natureTravail"
            value={formData.natureTravail}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Type de travaux à effectuer"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nom du Chantier *</label>
          <input
            type="text"
            name="nomChantier"
            value={formData.nomChantier}
            onChange={handleChange}
            className="form-input"
            required
            placeholder="Nom du projet"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date de Création</label>
          <input
            type="date"
            name="dateCreation"
            value={formData.dateCreation}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">État du chantier</label>
          <select
            name="etat"
            value={formData.etat}
            onChange={handleChange}
            className="form-input"
            disabled={!isEditing}
          >
            <option value="en cours">En cours</option>
            <option value="fermé">Fermé</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn"
            style={{ background: "#6c757d", color: "white" }}
          >
            Annuler
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? "Sauvegarde..." : isEditing ? "Modifier" : "Créer"}
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

export default ChantierForm;
