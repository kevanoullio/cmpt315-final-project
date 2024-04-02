import React from "react";
import Button from "react-bootstrap/Button";

/**
 * Function to render the RemoveFromCartButton component
 * @param {Object} menuItem - Object representing the menuItem
 * @param {Function} onRemoveFromCart - The function to remove a menuItem from the cart
 * @returns {JSX.Element} - The RemoveFromCartButton component
 */
const RemoveFromCartButton = ({ menuItem, onRemoveFromCart }) => {
    // Render the RemoveFromCartButton component based on enrollment criteria
    return <Button variant="danger" onClick={() => onRemoveFromCart(menuItem)}>Remove</Button>;
};

export default RemoveFromCartButton;
