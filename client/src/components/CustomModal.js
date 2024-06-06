import React from 'react';
import '../style/customModal.scss';

const CustomModal = ({ isOpen, onRequestClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onRequestClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onRequestClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
