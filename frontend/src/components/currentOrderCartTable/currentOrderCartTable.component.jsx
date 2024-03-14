// import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap/Table";
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
    );
};

export default CurrentOrderCartTable;
