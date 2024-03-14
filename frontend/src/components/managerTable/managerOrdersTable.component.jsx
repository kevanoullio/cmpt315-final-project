import React from "react";
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

function TableOfOrders({orders, onOrderSelection}) {

  const handleButtonClick = (orderId) => {
    // sets the selected order in App.js to the order id for the order in the row where the button was clicked
    onOrderSelection(orderId);
  };

  // if there are no rows in the table, just show the column headers:
  if (!orders || orders.length === 0) {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order No.</th>
            <th>Items</th>
            <th>Preferred Pickup</th>
            <th>Status</th>
          </tr>
        </thead>
      </Table>
    );
  } else {
    // when there are rows in the table, show the rows:
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order No.</th>
            <th>Items</th>
            <th>Preferred Pickup</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order =>(
                  <tr key={order.id}>
                      <td>{order.menuItems}</td>
                      <td>{order.pickupTime}</td>
                      <td>
                        {(() => {
                          let variant;
                          if (order.status === "Ordered") {
                            variant = "primary";
                          } else if (order.status === "In-Progress") {
                            variant = "danger";
                          } else if (order.status === "Awaiting-Pickup") {
                            variant = "warning";
                          } else if (order.status === "Completed") {
                            variant = "success";
                          } else {
                            variant = "secondary";
                          }

                          return (
                            <Button
                              variant={variant}
                              onClick={() => handleButtonClick(order._id)}
                            >
                              {order.status}
                            </Button>
                          );
                        })()}
                      </td>
                  </tr>
              ))}
        </tbody>
      </Table>
    );
  }
}

export default TableOfOrders;