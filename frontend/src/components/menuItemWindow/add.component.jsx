import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


/**
 * Function to render the menu item window component
 * @param {Boolean} showMenuItem - The boolean to show the menu item window
 * @param {Function} toggleMenuItem - The function to toggle the menu item window
 * @param {Function} onSubmit - The function to submit the addition of a menu item
 * @returns {JSX.Element} - The menu item window component
 */
const AddMenuItemWindow = ({showMenuItem, toggleMenuItem, onSubmit}) => {
  // variables to hold the menu item attributes
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageURL, setImageURL] = useState("https://via.placeholder.com/150");

  // Function to add new menu item
  const onSubmitButtonClick = () => {
    let itemStatus = available ? "in stock" : "sold-out";
    const menuItemAttributes = {
      "name": name,
      "status": itemStatus,
      "description": description,
      "price": price,
      "image": imageURL
    };
    onSubmit(menuItemAttributes);

    // Reset the variables
    setName("");
    setDescription("");
    setPrice("");
    setAvailable(true);
    setImageURL("https://via.placeholder.com/150")

    // Close the window
    toggleMenuItem();
  };

  // Function to cancel adding menu item
  const onCancel = () => {
    // Reset the variables
    setName("");
    setDescription("");
    setPrice("");
    setAvailable(true);
    setImageURL("https://via.placeholder.com/150")

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
        <Modal.Title>Add Menu Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="menu-item-container">
          <section className="menu-item-left-section">
            <Form>
              <Form.Group controlId="form-name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="form-price">
                <Form.Label>Price: numbers only (decimal point optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="$"
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
          // disable if not all fields filled out
          disabled={!name || !description || !price}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddMenuItemWindow;
