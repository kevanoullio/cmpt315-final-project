import { Button } from 'react-bootstrap';
import './previousOrder.styles.css';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const PreviousOrder = ({ order, completeOrder }) => {
  const [open, setOpen] = useState(false);

  const getSubtotal = () => {
    return order.menuItems.reduce(
      (accumulator, item) => accumulator + item.price, 0
    );
  }

  const getTime = () => {
    const date = new Date(order.pickupTime);
    return (
      date.toISOString() === "1970-01-01T00:00:00.000Z" ? "ASAP":
      `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    );
  }

  const setOrderComplete = () => {
    console.log("completed");
    completeOrder(order.id);
    setOpen(false);
  }

  return (
    <div className="order-bg" >
      <h5 className='order-name' >Order ID: {order.id}</h5>
      <div className='order-main'>
        <div>
          <h6>Items ordered:</h6>
          {order.menuItems.map((item, index) => (
            <p className='item-small' key={`${order.id}-item-${index}`}>{item.name} - ${item.price}</p>
          ))}

        </div>
        <div className='right' >
          <h5>{order.restaurantId.name}</h5>
          <p className='item'>Pickup time:</p>
          <p>{getTime()}</p>
          <hr />
          <p className='item'>Subtotal: ${getSubtotal().toFixed(2)}</p>
        </div>
      </div>
      <div className='status-button'>
        <h5 className='status' >Status: {order.status}</h5>
      </div>
      { order.status === "awaiting pickup" && (
        <div className='order-button' >
          <Button onClick={() => setOpen(true)} >Complete Order</Button>
        </div>
      )}
      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Order?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This will mark your order as completed</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOrderComplete()}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PreviousOrder;
