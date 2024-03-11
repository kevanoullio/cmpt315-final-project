// import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap/Table";
import MenuItem from "../menuItem/menuItem.component";
import "./currentOrderCartTable.styles.css";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItems - The list of menuItems
 * @param {Object} currentRestaurant - The current restaurant
 * @param {Array<Object>} availableMenuItems - The list of available menuItems
 * @param {Function} onAddToCart - The function to add a menuItem to the cart
 * @param {Function} onRemoveFromCart - The function to remove a menuItem from the cart
 * @returns {JSX.Element} - The menuItem table component
 */
const CurrentOrderCartTable = ({ menuItems, currentRestaurant, availableMenuItems, onAddToCart, onRemoveFromCart }) => {
    // Render the menuItem table
    return (
        <BootstrapTable className="bootstrap-table" striped bordered hover>
            <thead className="custom-header">
                <tr>
                <th>Item</th>
                <th>Price</th>
                <th>#</th>
                </tr>
            </thead>
            <tbody>
                {menuItems && menuItems.map((item, index) => (
                    <MenuItem 
                        key={index} 
                        menuItem={item} 
                        currentRestaurant={currentRestaurant} 
                        availableMenuItems={availableMenuItems}
                        onAddToCart={onAddToCart} 
                        onRemoveFromCart={onRemoveFromCart} 
                    />
                ))}
            </tbody>
        </BootstrapTable>
    );
};

export default CurrentOrderCartTable;
