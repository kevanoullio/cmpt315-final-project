import React from "react";
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table";

/**
 * Function to render the menuItem table component
 * @param {Array<Object>} menuItems - The list of menuItems
 * @param {Function} onItemSelection - The function to handle item selection
 * @param {Function} onEditSelection - The function to handle edit selection
 * @param {Function} onDeleteSelection - The function to handle delete selection
 * @returns {JSX.Element} - The menuItem table component
 */
const ManagerMenuItemsTable = ({ menuItems, onItemSelection, onEditSelection, onDeleteSelection }) => {
  const handleStatusButtonClick = (itemId) => {
    onItemSelection(itemId);
  };

  const handleEditButtonClick = (item) => {
    onEditSelection(item);
  };

  const handleDeleteButtonClick = (itemId) => {
    onDeleteSelection(itemId);
  }

  // Render the menuItem table
  return (
    <div className="table-responsive">
      <Table className="bootstrap-table" striped bordered hover>
        <thead className="custom-header">
        <tr>
          <th>Menu Item</th>
          <th>Image</th>
          <th>Item Description</th>
          <th>Price</th>
          <th>Status</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        </thead>
        <tbody>
        {menuItems && menuItems.map((item, _) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td className="w-25">
            <img
              loading="lazy"
              src={item.image ? item.image : "https://via.placeholder.com/150"}
              alt={item.name}
              style={{ maxWidth: "150px", height: "auto" }} // Set max-width and let height adjust automatically
            />
            </td>
            <td className="w-25">{item.description}</td>
            <td>{"$" + item.price}</td>
            <td>
              <Button
                variant={item.status === "sold-out" ? "danger" : "success"}
                onClick={() => handleStatusButtonClick(item.id)}
              >
                {item.status === "sold-out" ? "Sold Out" : "In Stock"}
              </Button>
            </td>
            <td>
              <Button
                variant="primary"
                onClick={() => handleEditButtonClick(item)}
              >
                Edit
              </Button>
            </td>
            <td>
              <Button
                variant="danger"
                onClick={() => handleDeleteButtonClick(item.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManagerMenuItemsTable;
