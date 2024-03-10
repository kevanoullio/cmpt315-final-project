import React from "react";

/**
 * Function to render the Restaurant component
 * @param {Object} restaurant - Object representing the Restaurant
 * @returns {JSX.Element} - The Restaurant component
 */
const Restaurant = ({ restaurant }) => (
    <tr>
		<td>{restaurant.id}</td>
		<td>{restaurant.name}</td>
		<td>{restaurant.address}</td>
		<td>{restaurant.phone}</td>
		<td>{restaurant.email}</td>
		<td>{restaurant.menuItems}</td>
    </tr>
);

export default Restaurant;
