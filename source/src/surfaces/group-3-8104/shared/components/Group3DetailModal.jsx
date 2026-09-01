import React, { useEffect, useRef } from "react";
import "./Group3DetailModal.css";

export function Group3DetailModal({ open, title, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    const handleClick = (e) => {
      if (e.target === dialog) {
        onClose();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className="g3-detail-modal">
      <div className="g3-detail-modal-content">
        <header className="g3-detail-modal-header">
          <h2>{title}</h2>
          <button type="button" className="g3-detail-modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>
        <div className="g3-detail-modal-body">
          {children}
        </div>
        <footer className="g3-detail-modal-footer">
          <button type="button" className="g3-practice-primary is-secondary" onClick={onClose}>ปิด</button>
        </footer>
      </div>
    </dialog>
  );
}
