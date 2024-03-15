import React from "react";
import Card from 'react-bootstrap/Card';
import './restaurantCard.styles.css';

/**
 * Function to render the Restaurant component
 * @param {Object} restaurant - Object representing the Restaurant
 * @param onClick
 * @returns {JSX.Element} - The Restaurant component
 */

const RestaurantCard = ({ restaurant, onClick }) => (
	<Card className="card"  onClick={onClick}>
		{/* <Card.Img variant="top" src={restaurant.image} /> */}
		<Card.Img variant="top"
			src="https://img.freepik.com/free-vector/vector-pastel-plate-food-sticker-clipart_53876-170585.jpg?w=826&t=st=1710138142~exp=1710138742~hmac=b4c26387026e4075a450797389cbdbb80a8c9a7ee760731925f7ac359d00134e" />
		<Card.Body>
			<Card.Title>{restaurant.name}</Card.Title>
			<Card.Text>
				{/* {restaurant.description} */}
				{restaurant.address}
				Restaurant description here
			</Card.Text>
			{/* <Button variant="primary">Go somewhere</Button> */}
		</Card.Body>
	</Card>
);

export default RestaurantCard;
