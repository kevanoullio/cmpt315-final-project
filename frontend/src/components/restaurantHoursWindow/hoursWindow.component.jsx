import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "./hoursWindow.styles.css";

/**
 * Function to render the menu item window component
 * @param {Boolean} showMenuItem - The boolean to show the checkout window
 * @param {Function} toggleMenuItem - The function to toggle the checkout window

 * @returns {JSX.Element} - The checkout window component
 */
const ChangeHoursWindow = ({ showHours, toggleHours, onSubmit }) => {
  // variables to hold the menu item attributes
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");

  // Function to submit menu item (changes or add new menu item)
  const onSubmitButtonClick = () => {
    const hoursAttributes = {
      "open": open,
      "close": close
    };
    onSubmit(hoursAttributes);

    // Close the window
    toggleHours();
  };

  // Function to cancel adding or editing menu item
  const onCancel = () => {
    // Close the window
    toggleHours();
  };

  return (
    <Modal
      className="menu-item-window"
      show={showHours}
      onHide={toggleHours}
      size="lg"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Restaurant Hours</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="menu-item-container">
          <section className="menu-item-left-section">
            <Form>
              <Form.Group controlId="form-name">
                <Form.Label>Open time</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="hh:mm in 24 hour time"
                  value={open}
                  onChange={(e) => setOpen(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-description">
                <Form.Label>Close time</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="hh:mm in 24 hour time"
                  value={close}
                  onChange={(e) => setClose(e.target.value)}
                />
              </Form.Group>
            </Form>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="cancel-button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="submit-button"
          variant="success"
          onClick={onSubmitButtonClick}
          // disable if no changes during edit or if not all fields filled out during add
          disabled={!open || !close}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ChangeHoursWindow;
