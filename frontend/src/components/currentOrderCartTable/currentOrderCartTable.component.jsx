// import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import MenuItem from "../menuItem/menuItem.component";
import "./currentOrderCartTable.styles.css";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItemsInCart - The list of menuItems in the cart
 * @param {Function} onRemoveFromCart - The function to remove a menuItem from the cart
 * @param {Function} onCheckout - The function to checkout the cart
 * @returns {JSX.Element} - The menuItem table component
 */
const CurrentOrderCartTable = ({ menuItemsInCart, onRemoveFromCart, onCheckout }) => {
    // Render the menuItem table
    return (
        <div className="current-order-cart-table">
            {/* <h2 className="h2">Your Order</h2> */}
            <BootstrapTable className="bootstrap-table" striped bordered hover>
                <thead className="custom-header">
                    <tr>
                        <th>Menu Item</th>
                        <th>Price</th>
                        {/* <th>#</th> >>> can add later if decide to have items stack up */}
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
            <div className="subtotal-checkout-container">
                <h3>Subtotal: ${menuItemsInCart.reduce((total, menuItem) => total + menuItem.price, 0).toFixed(2)}</h3>
                <Button variant="success" size="lg" onClick={() => onCheckout(menuItemsInCart)}>
                    Checkout
                </Button>
                <Button className="previous-orders-button" variant="secondary" size="md" block>
                    Previous Orders
                </Button>
            </div>
        </div>
    );
};

export default CurrentOrderCartTable;
