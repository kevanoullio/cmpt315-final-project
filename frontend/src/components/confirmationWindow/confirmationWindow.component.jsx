import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationWindow = ({ show, title, body, onConfirm, onCancel }) => {
  return (
    <Modal
      className="confirmation-window"
      show={show}
      onHide={onCancel}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationWindow;
