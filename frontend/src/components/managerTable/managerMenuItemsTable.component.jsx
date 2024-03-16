// import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import BootstrapTable from "react-bootstrap/Table";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItems - The list of menuItems
 * @returns {JSX.Element} - The menuItem table component
 */
const MenuItemTable = ({ menuItems, onItemSelection }) => {
    const handleStatusButtonClick = (itemId) => {
        onItemSelection(itemId);
      };

    // Render the menuItem table
    return (
        <BootstrapTable className="bootstrap-table" striped bordered hover>
            <thead className="custom-header">
                <tr>
                <th>Menu Item</th>
                <th>Item Description</th>
                <th>Price</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {menuItems && menuItems.map((item, index) => (
                    <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{"$" + item.price}</td>
                    <td>
                    <Button
                        variant={item.status === "sold-out" ? "danger" : "primary"}
                        onClick={() => handleStatusButtonClick(item.id)}
                      >
                        {item.status === "sold-out" ? "Sold Out" : "In Stock"}
                    </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </BootstrapTable>
    );
};

export default MenuItemTable;
