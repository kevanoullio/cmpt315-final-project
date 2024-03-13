import React from "react";
import { Dropdown } from "react-bootstrap";
import "./dropDown.styles.css";

/**
 * Function to render the DropDown component
 * @param {String} placeholder - String representing the placeholder text prior to user input
 * @param {Array} options - Array of objects representing the options
 * @param {Object} currentOption - Current object representing the current option
 * @param {Function} setFunction - Function to set the current option
 * @returns {JSX.Element} - The DropDown component
 */
const DropDown = ({ placeholder, options, currentOption, handleSelect }) => {
    // Variable to hold the display text
    let displayText;

    // If the currentOption is not null, set the displayText to the currentOption's name
    if (currentOption) {
        if (currentOption.name) {
            displayText = currentOption.name;
        } else if (currentOption.first_name && currentOption.last_name) {
            displayText = `${currentOption.first_name} ${currentOption.last_name}`;
        } else {
            displayText = placeholder;
        }
    } else {
        displayText = placeholder;
    }

    // Render the DropDown component
    return (
        <Dropdown className="dropdown" onSelect={handleSelect}>

            <Dropdown.Toggle className="dropdown-toggle" variant="success" id="dropdown-basic">
                {displayText}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu">
                {options.map((option, index) => (
                    <Dropdown.Item key={index} eventKey={option.id}>
                        {option.name || (option.first_name && option.last_name) || 'Unknown'}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>

        </Dropdown>
    );
}

export default DropDown;
