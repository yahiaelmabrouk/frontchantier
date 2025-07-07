import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ChargesForm.css";

const ChargesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedChargeType, setSelectedChargeType] = useState("");
  const [customChargeType, setCustomChargeType] = useState("");
  const [chargeName, setChargeName] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [charges, setCharges] = useState([]);
  const [chantier, setChantier] = useState(null);

  const chargeTypes = [
    "Achat",
    "Services extérieurs",
    "Interim",
    "Charges de personnel",
    "Charges fixes",
    "Autre",
  ];

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchChantier();
    fetchCharges();
  }, [id]);

  const fetchChantier = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chantiers/${id}`);
      const data = await response.json();
      setChantier(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchCharges = async () => {
    try {
      const response = await fetch(`${API_URL}/api/charges/chantier/${id}`);
      const data = await response.json();
      setCharges(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleChargeTypeChange = (e) => {
    const value = e.target.value;
    setSelectedChargeType(value);
    setCustomChargeType("");
    setChargeName("");
    setBudget("");
    setDescription("");
  };

  const handleSaveCharge = async () => {
    if (!selectedChargeType || !chargeName || !budget) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newCharge = {
      chantierId: id,
      type: selectedChargeType,
      customType: selectedChargeType === "Autre" ? customChargeType : undefined,
      name: chargeName,
      budget: parseFloat(budget),
      description,
    };

    try {
      const response = await fetch(`${API_URL}/api/charges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharge),
      });

      if (response.ok) {
        fetchCharges();
        resetForm();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const resetForm = () => {
    setSelectedChargeType("");
    setCustomChargeType("");
    setChargeName("");
    setBudget("");
    setDescription("");
  };

  const deleteCharge = async (chargeId) => {
    try {
      await fetch(`${API_URL}/api/charges/${chargeId}`, {
        method: "DELETE",
      });
      fetchCharges();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const calculateTotals = () => {
    const totals = {
      Achat: 0,
      "Services extérieurs": 0,
      Interim: 0,
      "Charges de personnel": 0,
      "Charges fixes": 0,
      Autre: 0,
      total: 0,
    };

    charges.forEach((charge) => {
      const type = charge.type === "Autre" ? "Autre" : charge.type;
      totals[type] += charge.budget;
      totals.total += charge.budget;
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="charges-form-container">
      <div className="form-header">
        <h2>Gestion des charges - {chantier?.nomChantier}</h2>
        <button onClick={() => navigate("/")} className="btn btn-secondary">
          ← Retour
        </button>
      </div>

      {/* Add New Charge Section */}
      <div className="add-charge-section">
        <h3>Ajouter une nouvelle charge</h3>

        <div className="charge-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type de charge *:</label>
              <select
                value={selectedChargeType}
                onChange={handleChargeTypeChange}
                className="form-select"
              >
                <option value="">-- Sélectionner un type --</option>
                {chargeTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {selectedChargeType === "Autre" && (
              <div className="form-group">
                <label className="form-label">Type personnalisé *:</label>
                <input
                  type="text"
                  placeholder="Saisir le type de charge"
                  value={customChargeType}
                  onChange={(e) => setCustomChargeType(e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nom de la charge *:</label>
              <input
                type="text"
                placeholder="Ex: Matériaux, Personnel, Transport..."
                value={chargeName}
                onChange={(e) => setChargeName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Budget *:</label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (optionnel):</label>
            <textarea
              placeholder="Description détaillée de la charge"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              onClick={handleSaveCharge}
              className="btn btn-primary"
              disabled={!selectedChargeType || !chargeName || !budget}
            >
              💾 Enregistrer la charge
            </button>
            <button onClick={resetForm} className="btn btn-secondary">
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Charges Summary */}
      {charges.length > 0 && (
        <div className="charges-summary">
          <h3>Résumé des charges</h3>
          <div className="summary-grid">
            {Object.entries(totals).map(
              ([type, amount]) =>
                type !== "total" &&
                amount > 0 && (
                  <div key={type} className="summary-item">
                    <span className="summary-type">{type}</span>
                    <span className="summary-amount">
                      {amount.toFixed(2)} €
                    </span>
                  </div>
                )
            )}
            <div className="summary-item total">
              <span className="summary-type">Total</span>
              <span className="summary-amount">
                {totals.total.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Existing Charges List */}
      <div className="charges-list-section">
        <h3>Charges existantes</h3>
        {charges.length === 0 ? (
          <p className="no-charges">Aucune charge ajoutée pour ce chantier.</p>
        ) : (
          <div className="charges-grid">
            {charges.map((charge) => (
              <div key={charge._id} className="charge-card">
                <div className="charge-header">
                  <div>
                    <span className="charge-type-badge">
                      {charge.type === "Autre"
                        ? charge.customType
                        : charge.type}
                    </span>
                    <h4 className="charge-name">{charge.name}</h4>
                  </div>
                  <button
                    onClick={() => deleteCharge(charge._id)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
                <div className="charge-budget">
                  {charge.budget.toFixed(2)} €
                </div>
                {charge.description && (
                  <p className="charge-description">{charge.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargesForm;
