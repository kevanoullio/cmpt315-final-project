import React from "react";
import Card from 'react-bootstrap/Card';

/**
 * Function to render the Restaurant component
 * @param {Object} restaurant - Object representing the Restaurant
 * @returns {JSX.Element} - The Restaurant component
 */

const RestaurantCard = ({ restaurant }) => (
    <Card style={{ width: "18rem" }}>
        {/* <Card.Img variant="top" src={restaurant.image} /> */}
        <Card.Img variant="top" src="holder.js/100x180" />
        <Card.Body>
            <Card.Title>{restaurant.name}</Card.Title>
            <Card.Text>
                {/* {restaurant.description} */}
                Restaurant description here
            </Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
        </Card.Body>
    </Card>
);

export default RestaurantCard;