import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/**
 * Function to render the order confirmation component
 * @param {Boolean} showConfirmation - The boolean to show the order confirmation
 * @param {Function} toggleConfirmation - The function to toggle the order confirmation
 * @returns {JSX.Element} - The order confirmation component
 */
const OrderConfirmation = ({ showConfirmation, toggleConfirmation, orderNumber }) => {
  return (
    <Modal
      show={showConfirmation}
      onHide={toggleConfirmation}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        {orderNumber ? (
          <Modal.Title>Order Confirmation</Modal.Title>
        ) : (
          <Modal.Title>Order Failed</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        {orderNumber ? (
          <p>Your order has been successfully submitted.
            <br />
            Your Order Number: {orderNumber}
            <br />
            <br />
            Thank you for your business!
          </p>
        ) : (
          <p>There was an error submitting your order. Please try again.</p>
        )}
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
