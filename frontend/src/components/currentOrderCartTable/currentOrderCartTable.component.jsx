// import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import MenuItem from "../menuItem/menuItem.component";
import "./currentOrderCartTable.styles.css";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItemsInCart - The list of menuItems in the cart
 * @param {Function} onRemoveFromCart - The function to remove a menuItem from the cart
 * @returns {JSX.Element} - The menuItem table component
 */
const CurrentOrderCartTable = ({ menuItemsInCart, onRemoveFromCart }) => {
    console.log("menuItemsInCart: ", menuItemsInCart);
    // Render the menuItem table
    return (
        <div className="current-order-cart-table">
            <h2 className="h2">Current Order</h2>
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
            <div className="subtotal-checkout-container">
                <h3>Subtotal: ${menuItemsInCart.reduce((acc, menuItem) => acc + menuItem.price, 0).toFixed(2)}</h3>
                <Button variant="success" size="lg" block>
                    Checkout
                </Button>
            </div>
        </div>
    );
};

export default CurrentOrderCartTable;
