// import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap/Table";
import MenuItem from "../menuItem/menuItem.component";
import "./currentOrderCartTable.styles.css";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItems - The list of menuItems
 * @param {Object} currentRestaurant - The current restaurant
 * @param {Object} currentCustomer - The current customer
 * @param {Function} onRemoveFromCart - The function to remove a menuItem from the cart
 * @returns {JSX.Element} - The menuItem table component
 */
const CurrentOrderCartTable = ({ menuItems, currentRestaurant, currentCustomer, onRemoveFromCart }) => {
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
                {menuItems && menuItems.map((menuItem, index) => (
                    <MenuItem
                        key={index} 
                        menuItem={menuItem}
                        currentRestaurant={currentRestaurant} 
                        currentCustomer={currentCustomer}
                        onRemoveFromCart={onRemoveFromCart} 
                    />
                ))}
            </tbody>
        </BootstrapTable>
    );
};

export default CurrentOrderCartTable;
