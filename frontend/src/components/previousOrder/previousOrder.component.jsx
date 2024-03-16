import './previousOrder.styles.css';

const PreviousOrder = ({ order }) => {

  const getSubtotal = () => {
    return order.menuItems.reduce(
      (accumulator, item) => accumulator + item.price, 0
    );
  }

  const getTime = () => {
    const date = new Date(order.pickupTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
    </div>
  );
};

export default PreviousOrder;
