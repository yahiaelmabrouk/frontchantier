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

  // New states for dynamic forms
  const [servicesData, setServicesData] = useState({
    "Locations de matériel": 0,
    Echafaudage: 0,
    Levage: 0,
    Transport: 0,
    "Sous-traitant": 0,
    Voirie: 0,
    "Divers 1": 0,
    "Divers 2": 0,
  });
  const [interimOuvriers, setInterimOuvriers] = useState([]);
  const [interimForm, setInterimForm] = useState({
    nom: "",
    heures: "",
    taux: "",
  });
  const [achatsPieces, setAchatsPieces] = useState([]);
  const [achatForm, setAchatForm] = useState({
    fournisseur: "",
    piece: "",
    prix: "",
    quantite: "",
  });
  const [salaries, setSalaries] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [personnelEntries, setPersonnelEntries] = useState([]);
  const [personnelForm, setPersonnelForm] = useState({
    salarieId: "",
    heures: "",
  });
  const [personnelTotal, setPersonnelTotal] = useState(0);

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
    fetchSalaries();
    fetchFournisseurs();
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

  const fetchSalaries = async () => {
    try {
      const res = await fetch(`${API_URL}/api/salaries`);
      const data = await res.json();
      setSalaries(Array.isArray(data) ? data : []);
    } catch (e) {
      setSalaries([]);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/fournisseurs`);
      const data = await res.json();
      setFournisseurs(Array.isArray(data) ? data : []);
    } catch (e) {
      setFournisseurs([]);
    }
  };

  const handleChargeTypeChange = (e) => {
    const value = e.target.value;
    setSelectedChargeType(value);
    setCustomChargeType("");
    setChargeName("");
    setBudget("");
    setDescription("");
    setServicesData({
      "Locations de matériel": 0,
      Echafaudage: 0,
      Levage: 0,
      Transport: 0,
      "Sous-traitant": 0,
      Voirie: 0,
      "Divers 1": 0,
      "Divers 2": 0,
    });
    setInterimOuvriers([]);
    setInterimForm({ nom: "", heures: "", taux: "" });
    setAchatsPieces([]);
    setAchatForm({ fournisseur: "", piece: "", prix: "", quantite: "" });
    resetPersonnelForm();
  };

  // --- Services extérieurs handlers ---
  const handleServicesChange = (key, value) => {
    setServicesData((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };
  const servicesTotal = Object.values(servicesData).reduce((a, b) => a + b, 0);

  // --- Interim handlers ---
  const handleInterimFormChange = (e) => {
    setInterimForm({
      ...interimForm,
      [e.target.name]: e.target.value,
    });
  };
  const addInterimOuvrier = () => {
    if (
      interimForm.nom &&
      interimForm.heures &&
      interimForm.taux &&
      !isNaN(Number(interimForm.heures)) &&
      !isNaN(Number(interimForm.taux))
    ) {
      setInterimOuvriers([
        ...interimOuvriers,
        {
          ...interimForm,
          heures: Number(interimForm.heures),
          taux: Number(interimForm.taux),
          cout: Number(interimForm.heures) * Number(interimForm.taux),
        },
      ]);
      setInterimForm({ nom: "", heures: "", taux: "" });
    }
  };
  const interimTotal = interimOuvriers.reduce((sum, o) => sum + o.cout, 0);

  // --- Achats handlers ---
  const handleAchatFormChange = (e) => {
    setAchatForm({
      ...achatForm,
      [e.target.name]: e.target.value,
    });
  };
  const addAchatPiece = () => {
    if (
      achatForm.fournisseur &&
      achatForm.piece &&
      achatForm.prix &&
      achatForm.quantite &&
      !isNaN(Number(achatForm.prix)) &&
      !isNaN(Number(achatForm.quantite))
    ) {
      setAchatsPieces([
        ...achatsPieces,
        {
          ...achatForm,
          prix: Number(achatForm.prix),
          quantite: Number(achatForm.quantite),
          total: Number(achatForm.prix) * Number(achatForm.quantite),
        },
      ]);
      setAchatForm({ fournisseur: "", piece: "", prix: "", quantite: "" });
    }
  };
  const achatsTotal = achatsPieces.reduce((sum, p) => sum + p.total, 0);

  const handlePersonnelFormChange = (e) => {
    setPersonnelForm({
      ...personnelForm,
      [e.target.name]: e.target.value,
    });
  };

  const addPersonnelEntry = () => {
    const salarie = salaries.find((s) => s._id === personnelForm.salarieId);
    const heures = Number(personnelForm.heures);
    // Prevent duplicate selection
    if (
      !salarie ||
      !heures ||
      heures <= 0 ||
      personnelEntries.some((p) => p.salarieId === salarie._id)
    )
      return;
    const total = salarie.tauxHoraire * heures;
    setPersonnelEntries([
      ...personnelEntries,
      {
        salarieId: salarie._id,
        nom: salarie.nom,
        tauxHoraire: salarie.tauxHoraire,
        heures,
        total,
      },
    ]);
    setPersonnelForm({ salarieId: "", heures: "" });
  };

  useEffect(() => {
    setPersonnelTotal(personnelEntries.reduce((sum, p) => sum + p.total, 0));
  }, [personnelEntries]);

  const resetPersonnelForm = () => {
    setPersonnelEntries([]);
    setPersonnelForm({ salarieId: "", heures: "" });
    setPersonnelTotal(0);
  };

  // --- Save Charge ---
  const handleSaveCharge = async () => {
    let newCharge;
    if (selectedChargeType === "Services extérieurs") {
      newCharge = {
        chantierId: id,
        type: selectedChargeType,
        name: "Services extérieurs",
        budget: servicesTotal,
        description,
        details: { ...servicesData },
      };
    } else if (selectedChargeType === "Interim") {
      newCharge = {
        chantierId: id,
        type: selectedChargeType,
        name: "Interim",
        budget: interimTotal,
        description,
        ouvriers: interimOuvriers,
      };
    } else if (selectedChargeType === "Achat") {
      newCharge = {
        chantierId: id,
        type: selectedChargeType,
        name: "Achat",
        budget: achatsTotal,
        description,
        pieces: achatsPieces,
      };
    } else if (selectedChargeType === "Charges de personnel") {
      if (personnelEntries.length === 0) {
        alert("Veuillez ajouter au moins un salarié.");
        return;
      }
      newCharge = {
        chantierId: id,
        type: selectedChargeType,
        name: "Charges de personnel",
        budget: personnelTotal,
        description,
        personnel: personnelEntries,
      };
    } else {
      if (!selectedChargeType || !chargeName || !budget) {
        alert("Veuillez remplir tous les champs obligatoires");
        return;
      }
      newCharge = {
        chantierId: id,
        type: selectedChargeType,
        customType:
          selectedChargeType === "Autre" ? customChargeType : undefined,
        name: chargeName,
        budget: parseFloat(budget),
        description,
      };
    }

    try {
      const response = await fetch(`${API_URL}/api/charges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharge),
      });

      if (response.ok) {
        fetchCharges();
        resetForm();
        resetPersonnelForm();
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
    setServicesData({
      "Locations de matériel": 0,
      Echafaudage: 0,
      Levage: 0,
      Transport: 0,
      "Sous-traitant": 0,
      Voirie: 0,
      "Divers 1": 0,
      "Divers 2": 0,
    });
    setInterimOuvriers([]);
    setInterimForm({ nom: "", heures: "", taux: "" });
    setAchatsPieces([]);
    setAchatForm({ fournisseur: "", piece: "", prix: "", quantite: "" });
    resetPersonnelForm();
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

          {/* Dynamic forms based on type */}
          {selectedChargeType === "Services extérieurs" && (
            <div className="services-form">
              <h4 className="subform-title">Détails Services extérieurs</h4>
              <div className="services-grid">
                {Object.keys(servicesData).map((key) => (
                  <div className="form-group" key={key}>
                    <label className="form-label">{key}</label>
                    <input
                      type="number"
                      min="0"
                      value={servicesData[key]}
                      onChange={(e) =>
                        handleServicesChange(key, e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                ))}
              </div>
              <div className="services-total">
                <strong>Total: </strong>
                <span>{servicesTotal.toFixed(2)} €</span>
              </div>
              <div className="form-group">
                <label className="form-label">Description (optionnel):</label>
                <textarea
                  placeholder="Description détaillée de la charge"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  rows="2"
                />
              </div>
              <div className="form-actions">
                <button
                  onClick={handleSaveCharge}
                  className="btn btn-primary"
                  disabled={servicesTotal === 0}
                >
                  💾 Enregistrer la charge
                </button>
                <button onClick={resetForm} className="btn btn-secondary">
                  🔄 Reset
                </button>
              </div>
            </div>
          )}

          {selectedChargeType === "Interim" && (
            <div className="interim-form">
              <h4 className="subform-title">Détails Interim</h4>
              <div className="interim-row">
                <div className="form-group">
                  <label className="form-label">Nom de l'ouvrier</label>
                  <input
                    type="text"
                    name="nom"
                    value={interimForm.nom}
                    onChange={handleInterimFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre d'heures</label>
                  <input
                    type="number"
                    name="heures"
                    min="0"
                    value={interimForm.heures}
                    onChange={handleInterimFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Taux horaire (€)</label>
                  <input
                    type="number"
                    name="taux"
                    min="0"
                    value={interimForm.taux}
                    onChange={handleInterimFormChange}
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ alignSelf: "end", marginTop: "24px" }}
                  onClick={addInterimOuvrier}
                  disabled={
                    !interimForm.nom || !interimForm.heures || !interimForm.taux
                  }
                >
                  + Ajouter ouvrier
                </button>
              </div>
              {interimOuvriers.length > 0 && (
                <div className="interim-list">
                  <table className="interim-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Heures</th>
                        <th>Taux</th>
                        <th>Coût</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interimOuvriers.map((o, idx) => (
                        <tr key={idx}>
                          <td>{o.nom}</td>
                          <td>{o.heures}</td>
                          <td>{o.taux}</td>
                          <td>{o.cout.toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="interim-total">
                    <strong>Total: </strong>
                    <span>{interimTotal.toFixed(2)} €</span>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Description (optionnel):</label>
                <textarea
                  placeholder="Description détaillée de la charge"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  rows="2"
                />
              </div>
              <div className="form-actions">
                <button
                  onClick={handleSaveCharge}
                  className="btn btn-primary"
                  disabled={interimOuvriers.length === 0}
                >
                  💾 Enregistrer la charge
                </button>
                <button onClick={resetForm} className="btn btn-secondary">
                  🔄 Reset
                </button>
              </div>
            </div>
          )}

          {selectedChargeType === "Achat" && (
            <div className="achat-form">
              <h4 className="subform-title">Détails Achats</h4>
              <div className="achat-row">
                <div className="form-group">
                  <label className="form-label">Nom du fournisseur</label>
                  {/* Use select for fournisseur */}
                  <select
                    name="fournisseur"
                    value={achatForm.fournisseur}
                    onChange={handleAchatFormChange}
                    className="form-input"
                  >
                    <option value="">-- Sélectionner un fournisseur --</option>
                    {fournisseurs.map((f) => (
                      <option key={f._id} value={f.nom}>
                        {f.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nom de pièce</label>
                  <input
                    type="text"
                    name="piece"
                    value={achatForm.piece}
                    onChange={handleAchatFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Prix par pièce (€)</label>
                  <input
                    type="number"
                    name="prix"
                    min="0"
                    value={achatForm.prix}
                    onChange={handleAchatFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantité</label>
                  <input
                    type="number"
                    name="quantite"
                    min="0"
                    value={achatForm.quantite}
                    onChange={handleAchatFormChange}
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ alignSelf: "end", marginTop: "24px" }}
                  onClick={addAchatPiece}
                  disabled={
                    !achatForm.fournisseur ||
                    !achatForm.piece ||
                    !achatForm.prix ||
                    !achatForm.quantite
                  }
                >
                  + Ajouter pièce
                </button>
              </div>
              {achatsPieces.length > 0 && (
                <div className="achat-list">
                  <table className="achat-table">
                    <thead>
                      <tr>
                        <th>Fournisseur</th>
                        <th>Pièce</th>
                        <th>Prix</th>
                        <th>Quantité</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {achatsPieces.map((p, idx) => (
                        <tr key={idx}>
                          <td>{p.fournisseur}</td>
                          <td>{p.piece}</td>
                          <td>{p.prix.toFixed(2)} €</td>
                          <td>{p.quantite}</td>
                          <td>{p.total.toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="achat-total">
                    <strong>Total: </strong>
                    <span>{achatsTotal.toFixed(2)} €</span>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Description (optionnel):</label>
                <textarea
                  placeholder="Description détaillée de la charge"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  rows="2"
                />
              </div>
              <div className="form-actions">
                <button
                  onClick={handleSaveCharge}
                  className="btn btn-primary"
                  disabled={achatsPieces.length === 0}
                >
                  💾 Enregistrer la charge
                </button>
                <button onClick={resetForm} className="btn btn-secondary">
                  🔄 Reset
                </button>
              </div>
            </div>
          )}

          {selectedChargeType === "Charges de personnel" && (
            <div className="personnel-form">
              <h4 className="subform-title">Détails Charges de personnel</h4>
              <div className="personnel-row">
                <div className="form-group">
                  <label className="form-label">Salarié</label>
                  <select
                    name="salarieId"
                    value={personnelForm.salarieId}
                    onChange={handlePersonnelFormChange}
                    className="form-input"
                  >
                    <option value="">-- Sélectionner --</option>
                    {salaries
                      .filter(
                        (s) =>
                          !personnelEntries.some((p) => p.salarieId === s._id)
                      )
                      .map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.nom} (Matricule: {s.matricule})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre d'heures</label>
                  <input
                    type="number"
                    name="heures"
                    min="0"
                    value={personnelForm.heures}
                    onChange={handlePersonnelFormChange}
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ alignSelf: "end", marginTop: "24px" }}
                  onClick={addPersonnelEntry}
                  disabled={
                    !personnelForm.salarieId ||
                    !personnelForm.heures ||
                    Number(personnelForm.heures) <= 0
                  }
                >
                  + Ajouter salarié
                </button>
              </div>
              {personnelEntries.length > 0 && (
                <div className="personnel-list">
                  <table className="personnel-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Taux horaire (€)</th>
                        <th>Heures</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personnelEntries.map((p, idx) => (
                        <tr key={idx}>
                          <td>{p.nom}</td>
                          <td>{p.tauxHoraire.toFixed(2)}</td>
                          <td>{p.heures}</td>
                          <td>{p.total.toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="personnel-total">
                    <strong>Total: </strong>
                    <span>{personnelTotal.toFixed(2)} €</span>
                  </div>
                </div>
              )}
              <div className="form-actions">
                <button
                  onClick={handleSaveCharge}
                  className="btn btn-primary"
                  disabled={personnelEntries.length === 0}
                >
                  💾 Enregistrer la charge
                </button>
                <button
                  onClick={resetPersonnelForm}
                  className="btn btn-secondary"
                >
                  🔄 Ajouter un autre salarié
                </button>
              </div>
            </div>
          )}

          {/* Default form for other types */}
          {selectedChargeType &&
            selectedChargeType !== "Services extérieurs" &&
            selectedChargeType !== "Interim" &&
            selectedChargeType !== "Achat" &&
            selectedChargeType !== "Charges de personnel" && (
              <>
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
              </>
            )}
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
