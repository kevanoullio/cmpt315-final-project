import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap/Table";
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from "react-bootstrap/Button";

import MenuItem from "../menuItem/menuItem.component";
import CheckoutWindow from "../checkoutWindow/checkoutWindow.component";
import PreviousOrder from "../previousOrder/previousOrder.component";

import "./currentOrderCartTable.styles.css";
import OrderConfirmation from "../orderConfirmation/orderConfirmation.component";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItemsInCart - The list of menuItems in the cart
 * @param {Function} onRemoveFromCart - The function to remove a menuItem from the cart
 * @param {Function} onCancelCheckout - The function to cancel the checkout
 * @param {Function} onSubmitOrder - The function to submit an order
 * @param {Boolean} showCheckout - The boolean to show the checkout window
 * @param {Function} toggleCheckout - The function to toggle the checkout window
 * @param {Boolean} showConfirmation - The boolean to show the order confirmation
 * @param {Function} toggleConfirmation - The function to toggle the order confirmation
 * @param {Date} selectedDate - The selected date
 * @param {Function} setSelectedDate - The function to set the selected date
 * @param {Date} selectedTime - The selected time
 * @param {Function} handleTimeChange - The function to handle time change
 * @param {Date} minDate - The minimum date
 * @param {Date} maxDate - The maximum date
 * @param {Date} minTime - The minimum time
 * @param {Date} minTimeToday - The minimum time for today
 * @param {Date} maxTime - The maximum time
 * @param {Boolean} asap - The boolean for ASAP
 * @param {Function} setAsap - The function to set ASAP
 * @param {Array<Object>} orders - The list of orders
 * @param {Object} currentCustomer - The current customer
 * @returns {JSX.Element} - The menuItem table component
 */
const CurrentOrderCartTable = ({ menuItemsInCart, onRemoveFromCart, onCancelCheckout, onSubmitOrder,
                              showCheckout, toggleCheckout, showConfirmation, toggleConfirmation,
                              selectedDate, setSelectedDate, selectedTime, getDateTimeConstraints,
                              handleTimeChange, asap, setAsap, orders, currentCustomer, completeOrder }) => {

  // used for prev orders side menu
  const [showPrevOrders, setShowPrevOrders] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const handleClosePrevOrders = () => setShowPrevOrders(false);
  const handleShowPrevOrders = () => setShowPrevOrders(true);

  useEffect(() => {
    setCustomerOrders(orders.filter((order) => order.customerId.id === currentCustomer.id));
  }, [currentCustomer, orders]);

  // Render the menuItem table
  return (
    <div className="current-order-cart-table">
      {/* <h2 className="h2">Your Order</h2> */}
      <div className="cart-table">
        <BootstrapTable className="bootstrap-table" striped bordered hover>
          <thead className="custom-header">
            <tr>
              <th>Menu Item</th>
              <th>Price</th>
              <th>#</th>
              <th>Cart</th>
            </tr>
          </thead>
          <tbody>
            {menuItemsInCart && menuItemsInCart.map((menuItem, index) => (
              <MenuItem
                key={index}
                menuItem={menuItem}
                onRemoveFromCart={onRemoveFromCart}
              />
            ))}
          </tbody>
        </BootstrapTable>
      </div>
      <div className="subtotal-checkout-container">
        <h3>Subtotal: ${menuItemsInCart.reduce((total, menuItem) => total + (menuItem.price * menuItem.quantity), 0).toFixed(2)}</h3>
        <Button
          variant="success"
          size="lg"
          onClick={toggleCheckout}
          disabled={!menuItemsInCart || menuItemsInCart.length === 0}
        >
          Checkout
        </Button>
        <Button className="previous-orders-button" variant="secondary" size="md" onClick={handleShowPrevOrders}>
          Previous Orders
        </Button>
      </div>
      <CheckoutWindow
        showCheckout={showCheckout}
        toggleCheckout={toggleCheckout}
        onCancelCheckout={onCancelCheckout}
        onSubmitOrder={onSubmitOrder}
        currentCustomer={currentCustomer}
        menuItemsInCart={menuItemsInCart}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        getDateTimeConstraints={getDateTimeConstraints}
        handleTimeChange={handleTimeChange}
        asap={asap}
        setAsap={setAsap}
      />
      <OrderConfirmation
        showConfirmation={showConfirmation}
        toggleConfirmation={toggleConfirmation}
      />
      <Offcanvas className="prev-orders" show={showPrevOrders} onHide={handleClosePrevOrders} placement="end" >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Previous Orders</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="order-backdrop">
          {customerOrders.length > 0 ? customerOrders.map((order, index) => (
            <PreviousOrder key={`order-${index}`} order={order} completeOrder={completeOrder} />
          )) : (<p>no previous orders</p>)}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CurrentOrderCartTable;
