import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


/**
 * Function to render the menu item window component
 * @param {Boolean} showMenuItem - The boolean to show this menu item window
 * @param {Function} toggleMenuItem - The function to toggle this menu item window
 * @param {Function} onSubmit - The function to submit the update of a menu item
 * @param {Object} menuItemToEdit - The menu item that the user would like to edit 
 * @returns {JSX.Element} - The menu item window component
 */
const EditMenuItemWindow = ({showMenuItem, toggleMenuItem, onSubmit, menuItemToEdit}) => {
  // variables to hold the menu item attributes
  const [id, setId] = useState(menuItemToEdit ? menuItemToEdit.id : "");
  const [name, setName] = useState(menuItemToEdit ? menuItemToEdit.name: "");
  const [description, setDescription] = useState(menuItemToEdit ? menuItemToEdit.description : "");
  const [price, setPrice] = useState(menuItemToEdit ? menuItemToEdit.price : "");
  const [available, setAvailable] = useState(menuItemToEdit ? menuItemToEdit.status === "in stock" : true);
  const [imageURL, setImageURL] = useState(menuItemToEdit ? menuItemToEdit.image : "https://via.placeholder.com/150");

  useEffect(() => {
    if (menuItemToEdit) {
      setId(menuItemToEdit.id);
      setName(menuItemToEdit.name);
      setDescription(menuItemToEdit.description);
      setPrice(menuItemToEdit.price);
      setAvailable(menuItemToEdit.status === "in stock");
      setImageURL(menuItemToEdit.image);
    }
  }
  , [menuItemToEdit]);

  // Function to submit update of menu item
  const onSubmitButtonClick = () => {
    let itemStatus = available ? "in stock" : "sold-out";
    const menuItemAttributes = {
      id: id,
      name: name,
      status: itemStatus,
      description: description,
      price: price,
      image: imageURL
    };
    onSubmit(menuItemAttributes);
    // Close the window
    toggleMenuItem();
  };

  // Function to cancel editing menu item
  const onCancel = () => {
    // Revert any changes made while in the window so that if the window is opened again immediately it won't show the unsaved changes
    setId(menuItemToEdit.id);
    setName(menuItemToEdit.name);
    setDescription(menuItemToEdit.description);
    setPrice(menuItemToEdit.price);
    setAvailable(menuItemToEdit.status === "in stock");
    setImageURL(menuItemToEdit.image);
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
        <Modal.Title>Edit Menu Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="menu-item-container">
          <section className="menu-item-left-section">
            <Form>
              <Form.Group controlId="form-name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-price">
                <Form.Label>Price: numbers only (decimal point optional)</Form.Label>
                <Form.Control
                  type="text"
                  value={price}
                  onChange={(e) => {
                    const inputPrice = e.target.value;
                    // Check if the input is a valid number
                    if (/^\d*\.?\d*$/.test(inputPrice)) {
                      setPrice(inputPrice);
                    }
                  }}
                  pattern="^\d*\.?\d*$" // Only allow numbers (decimal point optional)
                />
              </Form.Group>

              <Form.Group controlId="form-image">
                <Form.Label>Image URL (should link directly to an image)</Form.Label>
                <Form.Control
                  type="text"
                  value={imageURL}
                  placeholder="Enter image URL"
                  onChange={(e) => setImageURL(e.target.value)}
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
          // disable if no changes during edit
          disabled={!name || !description || !price}
        >
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditMenuItemWindow;
