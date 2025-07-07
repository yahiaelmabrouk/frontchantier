import React from "react";
import "./Popup.css";

const Popup = ({
  isOpen,
  onClose,
  title,
  type = "info",
  children,
  showCancel = false,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleBackdropClick}>
      <div className={`popup-container ${type}`}>
        <div className="popup-header">
          <h3 className="popup-title">{title}</h3>
          <button className="popup-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="popup-content">{children}</div>

        <div className="popup-actions">
          {showCancel && (
            <button className="btn btn-cancel" onClick={onClose}>
              Annuler
            </button>
          )}
          <button
            className={`btn ${showCancel ? "btn-danger" : "btn-primary"}`}
            onClick={showCancel ? onConfirm : onClose}
          >
            {showCancel ? "Confirmer" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
