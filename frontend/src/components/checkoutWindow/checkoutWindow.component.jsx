import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";

import MenuItem from "../menuItem/menuItem.component";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import 'react-clock/dist/Clock.css';
import "./checkoutWindow.styles.css";

/**
 * Function to render the checkout window component
 * @param {Boolean} showCheckout - The boolean to show the checkout window
 * @param {Function} toggleCheckout - The function to toggle the checkout window
 * @param {Function} onCancelCheckout - The function to cancel the checkout
 * @param {Function} onSubmitOrder - The function to submit an order
 * @param {Object} currentCustomer - The current customer
 * @param {ArrayObject} menuItemsInCart - The list of menuItems in the cart
 * @param {Date} selectedDate - The selected date
 * @param {Function} setSelectedDate - The function to set the selected date
 * @param {Date} selectedTime - The selected time
 * @param {Function} setSelectedTime - The function to set the selected time
 * @param {Function} getDateConstraints - The function to get date constraints
 * @param {Function} getTimeConstraints - The function to get time constraints
 * @param {Boolean} asap - The boolean for ASAP
 * @param {Function} setAsap - The function to set ASAP
 * @returns {JSX.Element} - The checkout window component
 */
const CheckoutWindow = ({ showCheckout, toggleCheckout, onCancelCheckout, onSubmitOrder,
  currentCustomer, menuItemsInCart, selectedDate, setSelectedDate, selectedTime, setSelectedTime,
  dateConstraints, timeConstraints, asap, setAsap }) => {

  const { minDate, maxDate } = dateConstraints;
  const { minTime, maxTime } = timeConstraints;

  const [inputStyle, setInputStyle] = useState({});

  const validateTime = (event) => {
    const time = event.target.value;

    if (time >= minTime && time <= maxTime) {
      setInputStyle({ backgroundColor: "white" });
    } else {
      setInputStyle({ backgroundColor: "salmon" });
    }
  };

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
              <h5>Select a pickup date and time:</h5>
              <DatePicker
                selected={selectedDate}
                onChange={setSelectedDate}
                minDate={minDate}
                maxDate={maxDate}
                disabled={asap}
              />
              <br />
              <input
                type="time"
                value={selectedTime}
                min={minTime}
                max={maxTime}
                required
                onChange={(event) => {
                  setSelectedTime(event.target.value);
                  validateTime(event);
                }}
                style={inputStyle}
                disabled={asap}
              />
              <Form>
                {["checkbox"].map((type) => (
                  <div key={type} className="mb-3">
                    <Form.Check
                      className="checkbox-asap"
                      type={type}
                      id={`asap-${type}`}
                      label="ASAP"
                      onChange={() => setAsap(!asap)}
                    />
                  </div>
                ))}
              </Form>
            </div>
          </section>
          <section className="checkout-order-summary">
            <div className="checkout-table">
              <BootstrapTable className="bootstrap-table" striped bordered hover>
                <thead className="custom-header">
                  <tr>
                    <th>Menu Item</th>
                    <th>Price</th>
                    <th>#</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItemsInCart && menuItemsInCart.map((menuItem, index) => (
                    <MenuItem key={index} menuItem={menuItem} />
                  ))}
                </tbody>
              </BootstrapTable>
              <h3>Order Total: ${menuItemsInCart.reduce((total, menuItem) => total + (menuItem.price * menuItem.quantity), 0).toFixed(2)}</h3>
            </div>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="cancel-order-button"
          variant="secondary"
          onClick={onCancelCheckout}
        >
          Cancel
        </Button>
        <Button
          className="submit-order-button"
          variant="success"
          onClick={onSubmitOrder}
          disabled={!asap && (
                      !menuItemsInCart ||
                      menuItemsInCart.length === 0 ||
                      !selectedTime ||
                      //this is complicated cause when a valid time is selected it swaps to a string from a Date so we check both just in case
                      (typeof selectedTime != "string" ? selectedTime?.toLocaleTimeString('en-US',{hour12: false}) < minTime : selectedTime < minTime)
                    )
                  }
        >
          Submit Order
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CheckoutWindow;
