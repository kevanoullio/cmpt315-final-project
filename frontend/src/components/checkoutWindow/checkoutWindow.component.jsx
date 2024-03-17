import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import MenuItem from "../menuItem/menuItem.component";
import DateTimePicker from "../dateTimePicker/dateTimePicker.component";
import "./checkoutWindow.styles.css";

/**
 * Function to render the checkout window component
 * @param {Boolean} showCheckout - The boolean to show the checkout window
 * @param {Function} toggleCheckout - The function to toggle the checkout window
 * @param {Function} onSubmitOrder - The function to submit an order
 * @param {Object} currentCustomer - The current customer
 * @param {ArrayObject} menuItemsInCart - The list of menuItems in the cart
 * @returns {JSX.Element} - The checkout window component
 */
const CheckoutWindow = ({ showCheckout, toggleCheckout, onSubmitOrder, currentCustomer, menuItemsInCart }) => {

  const [dateTime, setDateTime] = useState(new Date());

  return (
    <Modal
      className="checkout-window"
      show={showCheckout}
      onHide={toggleCheckout}
      size="lg"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Your Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="checkout-container">
          <section className="checkout-left-section">
            <div className="checkout-cust-info">
              {currentCustomer && (
                <>
                  <h4><u>Customer Information</u></h4>
                  <h5>
                    Name: {currentCustomer.name}<br />
                    Email: {currentCustomer.email}<br />
                    Address: {currentCustomer.address}
                  </h5>
                </>
              )}
            </div>
            <div className="date-time-picker">
              <DateTimePicker />
            </div>
          </section>
          <section className="checkout-order-summary">
            <div className="checkout-table">
              <BootstrapTable className="bootstrap-table" striped bordered hover>
                <thead className="custom-header">
                  <tr>
                    <th>Menu Item</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItemsInCart && menuItemsInCart.map((menuItem, index) => (
                    <MenuItem key={index} menuItem={menuItem} />
                  ))}
                </tbody>
              </BootstrapTable>
              <h3>Subtotal: ${menuItemsInCart.reduce((total, menuItem) => total + menuItem.price, 0).toFixed(2)}</h3>
            </div>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="cancel-order-button"
          variant="secondary"
          onClick={toggleCheckout}
        >
          Cancel
        </Button>
        <Button
          className="submit-order-button"
          variant="success"
          onClick={onSubmitOrder}
          disabled={!menuItemsInCart || menuItemsInCart.length === 0}
        >
          Submit Order
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CheckoutWindow;
