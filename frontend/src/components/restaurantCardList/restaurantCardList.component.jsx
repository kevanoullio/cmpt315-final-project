import React, { useState, useEffect } from "react";
// import BootstrapTable from "react-bootstrap/Table";
import Restaurant from "../restaurant/restaurant.component";
import "./restaurantList.styles.css";

/**
 * Function to render the restaurant list component
 * @param {Array<Object>} restaurants - The list of restaurants
 * @returns {JSX.Element} - The restaurant list component
 */
const RestaurantList = ({ restaurants }) => {

    // >>>>>>>> CAN ADD SORT BY RATING OR SOMETHING <<<<<<<< //

    // const [sortedData, setSortedData] = useState(restaurants);
    // const [sortDirections, setSortDirections] = useState({}); // Keep track of the sort direction

    // // Update the sorted data when the restaurants change
    // useEffect(() => {
    //     setSortedData(restaurants);
    // }, [restaurants]);

    // /**
    //  * Function to handle sorting by column value
    //  * @param {String} columnName - The column name to sort by
    //  * @returns {void} - The function does not return a value
    //  */
    // const handleSort = (columnName) => {
    //     // Determine the sort direction
    //     const sortDirection = sortDirections[columnName] === "asc" ? "desc" : "asc";

    //     // Update the sort direction
    //     const sorted = [...sortedData].sort((a, b) => {
    //         // Sort the data in ascending or descending order
    //         if (a[columnName] < b[columnName]) return sortDirection === "asc" ? -1 : 1;
    //         if (a[columnName] > b[columnName]) return sortDirection === "asc" ? 1 : -1;
    //         return 0;
    //     });

    //     // Update the sorted data
    //     setSortedData(sorted);

    //     // Update the sort direction
    //     setSortDirections({ [columnName]: sortDirection });
    // };

    // Render the restaurant list
    return (
        <div class="card-deck">
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
                </div>
                <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
        </div>
    );
};

export default RestaurantList;
