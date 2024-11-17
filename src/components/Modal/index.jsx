import React from "react";
import './style.css'

const ModalComponent = ({ children, heading, onClose, isOpen }) => {
    return isOpen && (
        <div className="modal-overlay" >
            <div className="modal-content" >
                <div className="modal-heading">
                    <div className="heading">{heading}</div>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <hr />
                {children}
            </div>
        </div>
    )
};

export default ModalComponent;
