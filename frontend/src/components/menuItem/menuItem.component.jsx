import React from "react";

/**
 * Function to render the MenuItem component
 * @param {Object} menuItems - Object representing the menuItems
 * @returns {JSX.Element} - The menuItems component
 */
const menuItems = ({menuItem}) => {
      return (
        <tr>
              <td>{menuItem.id}</td>
              <td>{menuItem.name}</td>
              <td>{menuItem.status}</td>
              <td>{menuItem.description}</td>
              <td>{menuItem.price}</td>
        </tr>
      );
};

export default menuItems;
