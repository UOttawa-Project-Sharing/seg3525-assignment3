import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function PopupWindow({ visible, title, onClose, children, footer }) {
    return (
        <Modal show={visible} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                {footer !== undefined ? footer : (
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}