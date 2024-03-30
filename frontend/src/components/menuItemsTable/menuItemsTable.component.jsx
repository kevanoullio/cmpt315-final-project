import React from "react";
import BootstrapTable from "react-bootstrap/Table";
import MenuItem from "../menuItem/menuItem.component";
import "./menuItemsTable.styles.css";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItems - The list of menuItems
 * @param {Object} currentRestaurant - The current restaurant
 * @param {Object} currentCustomer - The current customer
 * @param {Function} onAddToCart - The function to add a menuItem to the cart
 * @returns {JSX.Element} - The menuItem table component
 */
const MenuItemTable = ({ menuItems, currentRestaurant, currentCustomer, onAddToCart }) => {
  // Render the menuItem table
  return (
    <div className="table-responsive" >
      <BootstrapTable className="bootstrap-table" striped bordered hover>
        <thead className="custom-header">
          <tr>
            <th>Menu Item</th>
            <th>Item Description</th>
            <th>Price</th>
            <th>Add To Cart</th>
          </tr>
        </thead>
        <tbody>
          {menuItems && menuItems.map((menuItem, index) => (
            <MenuItem
              key={index}
              menuItem={menuItem}
              currentRestaurant={currentRestaurant}
              currentCustomer={currentCustomer}
              onAddToCart={onAddToCart}
            />
          ))}
        </tbody>
      </BootstrapTable>
    </div>
  );
};

export default MenuItemTable;
