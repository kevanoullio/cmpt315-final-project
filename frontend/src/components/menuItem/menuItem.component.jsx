import React from "react";
import AddToCartButton from "../addToCartButton/addToCartButton.component";
import RemoveFromCartButton from "../removeFromCartButton/removeFromCartButton.component";
import "./menuItem.styles.css";

/**
 * Function to render the MenuItem component
 * @param {Object} menuItem - Object representing the menuItems
 * @param {Object} currentRestaurant - The current restaurant
 * @param {Object} currentCustomer - The current customer
 * @param {Function} onAddToCart - The function to add a menuItem to the cart
 * @param {Function} onRemoveFromCart - The function to remove a menuItem from the cart
 * @returns {JSX.Element} - The menuItems component
 */
const menuItem = ({menuItem, currentRestaurant, currentCustomer, onAddToCart, onRemoveFromCart}) => {
	return (
		onAddToCart !== undefined && onRemoveFromCart === undefined ?
			<tr>
				<td>{menuItem.name}</td>
				<td>{menuItem.description}</td>
				<td>{"$" + menuItem.price}</td>
				<td className="button-cell">
					<AddToCartButton
						menuItem={menuItem}
						currentRestaurant={currentRestaurant}
						currentCustomer={currentCustomer}
						onAddToCart={onAddToCart}
					/>
				</td>
			</tr>
		: onAddToCart === undefined && onRemoveFromCart !== undefined ?
			<tr>
				<td>{menuItem.name}</td>
				<td>{"$" + menuItem.price}</td>
				<td>{menuItem.quantity}</td>
        <td>{"$" + menuItem.price * menuItem.quantity}</td>
				<td className="button-cell">
					<RemoveFromCartButton
						menuItem={menuItem}
						onRemoveFromCart={onRemoveFromCart}
					/>
				</td>
			</tr>
    : onAddToCart === undefined && onRemoveFromCart === undefined ?
      <tr>
        <td>{menuItem.name}</td>
        <td>{"$" + menuItem.price}</td>
        <td>{menuItem.quantity}</td>
        <td>{"$" + menuItem.price * menuItem.quantity}</td>
      </tr>
		: null
	)
};

export default menuItem;
