import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge'; // Import Badge for colored status labels
import Modal from 'react-bootstrap/Modal';
import axiosClient from "../../axios";

function TableOfOrders({ orders, onUpdateOrderStatus, onUpdateOrderPickupTime, getOrders }) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [timeAssignOrder, setTimeAssignOrder] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false); // state to control the display of the time input

  const handleOpenTimePicker = (order) => {
    // Set the order for which the time is being set
    setTimeAssignOrder(order);
    setShowTimePicker(true); // Show the time input
    // Reset the previously selected time or set a default value
    setSelectedTime("");
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSaveTime = async () => {
    // Update the order with the new time (local time)
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, add 1
    const year = today.getFullYear();

    const formattedTime = `${year}-${month}-${day}T${selectedTime}:00`;
    await onUpdateOrderPickupTime(timeAssignOrder.id, formattedTime);

    // Reset the UI state
    setShowTimePicker(false);
    setSelectedTime("");
    setTimeAssignOrder(null);
  };

  const onDelete = (order) => {
    setOrder(order);
    setOpen(true);
  }

  const onDeleteConfirm = () => {
    deleteOrder();
    setOpen(false);
  }

  const deleteOrder = async () => {
    try {
      const response = await axiosClient.delete(`/orders/${order.id}`);
      getOrders();
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

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
    switch (status) {
      case "ordered": return "primary";
      case "in-progress": return "warning";
      case "awaiting pickup": return "info";
      case "completed": return "success";
      default: return "secondary";
    }
  };

  // Render the table
  return (
    <div className="table-responsive">
      <Table className="bootstrap-table" striped bordered hover>
        <thead className="custom-header">
          <tr>
            <th>Order No.</th>
            <th>Items</th>
            <th>Preferred Pickup</th>
            <th>Status</th>
            <th>Update Status</th>
            <th>Delete</th>
            <th>Select Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <div className="orderItems" >
                  {order.menuItems.map(item => item.name).join(', ')}
                  <br/>
                  {`Subtotal: $${order.menuItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}`}
                </div>
              </td>
              <td>
                <div className="orderTime">
                  {order.pickupTime === "1970-01-01T00:00:00.000Z"
                    ? "ASAP - Assign Time"
                    : <>
                      {new Date(order.pickupTime).toLocaleString().split(",")[0]}
                      <br />
                      {new Date(order.pickupTime).toLocaleString().split(",")[1]}
                    </>
                  }
                </div>
              </td>
              <td>
                <Badge bg={getBadgeVariant(order.status.toLowerCase())}>
                  {order.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleStatusUpdateClick(order)}
                  disabled={order.status === "completed"} // Disable button if order is completed
                >
                  Forward Status
                </Button>
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  onClick={() => onDelete(order)}
                >
                  Delete
                </Button>
              </td>
              <td>
                {order.pickupTime === "1970-01-01T00:00:00.000Z" && (
                  <>
                    {showTimePicker && order === timeAssignOrder ? (
                      <>
                        <input
                          type="time"
                          value={selectedTime}
                          onChange={handleTimeChange}
                          required
                        />
                        <Button variant="success" onClick={handleSaveTime}>Save</Button>
                      </>
                    ) : (
                      <Button variant="secondary" onClick={() => handleOpenTimePicker(order)}>Assign Time</Button>
                    )}
                  </>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="text-center">No orders found</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Order?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This will delete this order for the customer as well</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onDeleteConfirm()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TableOfOrders;
