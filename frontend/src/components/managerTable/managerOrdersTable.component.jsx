import React from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge'; // Import Badge for colored status labels

function TableOfOrders({ orders, onUpdateOrderStatus }) {

  // Function to get the next status based on the current status
  const getNextStatus = (currentStatus) => {
    const statusFlow = ["ordered", "in-progress", "awaiting pickup", "completed"];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex === statusFlow.length - 1 ? currentStatus : statusFlow[currentIndex + 1];
  };
  
  const handleStatusUpdateClick = (order) => {
    const nextStatus = getNextStatus(order.status);
    onUpdateOrderStatus(order.id, nextStatus);
  };

  // Helper function to determine the variant of the badge based on the order status
  const getBadgeVariant = (status) => {
    switch(status) {
      case "ordered": return "primary";
      case "in-progress": return "warning";
      case "awaiting pickup": return "info";
      case "completed": return "success";
      default: return "secondary";
    }
  };

  // Render the table
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Order No.</th>
          <th>Items</th>
          <th>Preferred Pickup</th>
          <th>Status</th>
          <th>Update Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? orders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.menuItems.map(item => item.name).join(', ')}</td>
            <td>{new Date(order.pickupTime).toLocaleString()}</td>
            <td>
              <Badge bg={getBadgeVariant(order.status.toLowerCase())}>
                {order.status}
              </Badge>
            </td>
            <td>
              <Button
                variant="outline-primary"
                onClick={() => handleStatusUpdateClick(order)}
                disabled={order.status === "completed"} // Disable button if order is completed
              >
                Forward Status
              </Button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="5" className="text-center">No orders found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default TableOfOrders;