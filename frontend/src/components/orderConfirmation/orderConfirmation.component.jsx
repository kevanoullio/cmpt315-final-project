import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 * Function to render the order confirmation component
 * @param {Boolean} showConfirmation - The boolean to show the order confirmation
 * @param {Function} toggleConfirmation - The function to toggle the order confirmation
 * @returns {JSX.Element} - The order confirmation component
 */
const OrderConfirmation = ({ showConfirmation, toggleConfirmation }) => {
  return (
    <Modal
      show={showConfirmation}
      onHide={toggleConfirmation}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Order Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Thank you for your order! Your order has been successfully submitted.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={toggleConfirmation}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default OrderConfirmation;
