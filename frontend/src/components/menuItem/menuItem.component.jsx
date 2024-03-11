import React from "react";

/**
 * Function to render the MenuItem component
 * @param {Object} menuItems - Object representing the menuItems
 * @returns {JSX.Element} - The menuItems component
 */
const menuItems = ({ menuItems }) => (
    <tr>
		<td>{menuItems.id}</td>
		<td>{menuItems.name}</td>
		<td>{menuItems.status}</td>
		<td>{menuItems.description}</td>
		<td>{menuItems.price}</td>
    </tr>
);

export default menuItems;
