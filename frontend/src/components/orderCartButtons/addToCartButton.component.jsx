import React from "react";
import Button from "react-bootstrap/Button";

/**
 * Function to render the AddToCartButton component
 * @param {Object} menuItem - Object representing the menuItem
 * @param {Object} currentRestaurant - The current restaurant
 * @param {Object} currentCustomer - The current customer
 * @param {Function} onAddToCart - The function to add a menuItem to the cart
 * @returns {JSX.Element} - The AddToCartButton component
 */
const AddToCartButton = ({ menuItem, currentRestaurant, currentCustomer, onAddToCart }) => {
    // Render the AddToCartButton component based on enrollment criteria
    if (!currentRestaurant || !currentRestaurant.id) {
        return <Button variant="secondary" disabled>No Restaurant</Button>;
    } else if (!currentCustomer || !currentCustomer.id) {
        return <Button variant="secondary" disabled>No Customer</Button>;
    } else if (menuItem.status === "sold-out") {
        return <Button variant="danger" disabled>Sold Out</Button>;
    } else if (menuItem.status === "in stock") {
        return <Button variant="primary" onClick={() => onAddToCart(menuItem)}>Add Item</Button>;
    } else {
        return <Button variant="secondary" disabled>Unknown Status</Button>;
    }
};

export default AddToCartButton;
