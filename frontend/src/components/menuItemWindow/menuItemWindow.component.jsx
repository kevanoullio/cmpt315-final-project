import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "./menuItemWindow.styles.css";

/**
 * Function to render the menu item window component
 * @param {Boolean} showMenuItem - The boolean to show the menu item window
 * @param {Function} toggleMenuItem - The function to toggle the menu item window
 * @param {Function} onSubmit - The function to submit the addition, deletion, or update of a menu item
 * @returns {JSX.Element} - The menu item window component
 */
const MenuItemWindow = ({ showMenuItem, toggleMenuItem, onSubmit, menuItemToEdit }) => {
  // variables to hold the menu item attributes
  const [id, setId] = useState(menuItemToEdit ? menuItemToEdit.id : "");
  const [name, setName] = useState(menuItemToEdit ? menuItemToEdit.name : "Enter name");
  const [description, setDescription] = useState(menuItemToEdit ? menuItemToEdit.description : "Enter description");
  const [price, setPrice] = useState(menuItemToEdit ? menuItemToEdit.price : "Enter price without dollar sign");
  const [available, setAvailable] = useState(menuItemToEdit ? menuItemToEdit.status === "in stock" : false);

  // Function to submit menu item (update or add menu item)  
  const onSubmitButtonClick = () => {
    let itemStatus = available ? "in stock" : "sold-out";
    const menuItemAttributes = {
      id: id,
      name: name,
      status: itemStatus,
      description: description,
      price: price
    };
    onSubmit(menuItemAttributes);

    // Reset the variables
    setId("");
    setName("");
    setDescription("");
    setPrice("");
    setAvailable(false);

    // Close the window
    toggleMenuItem();
  };

  // Function to cancel adding or editing menu item 
  const onCancel = () => {
    // Reset the variables
    setId("");
    setName("");
    setDescription("");
    setPrice("");
    setAvailable(false);

    // Close the window
    toggleMenuItem();
  };

  return (
    <Modal
      className="menu-item-window"
      show={showMenuItem}
      onHide={toggleMenuItem}
      size="lg"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{menuItemToEdit ? "Edit or Delete Menu Item" : "Add Menu Item"}</Modal.Title> 
      </Modal.Header>
      <Modal.Body>
        <div className="menu-item-container">
          <section className="menu-item-left-section">
              <Form>
              <Form.Group controlId="form-name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={description}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={price} // TODO: handle this better (maybe show $ before text field?)
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-status">
                <Form.Check
                  type="checkbox" // should not be a string because we want consistent wording in backend 
                  label="In Stock"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
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
          disabled={!name || !description || !price}
        >
          {menuItemToEdit ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MenuItemWindow;
