import React from "react";
import "./searchBar.styles.css";

/**
 * Function to render the SearchBar component
 * @param {String} placeholder - The placeholder text prior to user input
 * @param {String} handleInput - The user input text
 * @returns {JSX.Element} - The SearchBar component
 */
const SearchBar = ({ placeholder, handleInput }) => (
    <input
        className="search-bar"
        type="search"
        placeholder={placeholder}
        onChange={handleInput}
    />
);

export default SearchBar;
