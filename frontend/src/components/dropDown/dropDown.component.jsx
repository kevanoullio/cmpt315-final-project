import React, { useEffect, useState } from "react";
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
const DropDown = ({ options, currentOption, onManagerSelection }) => {
    // change selected manager to state var so it re
    const [selected, setSelected] = useState(currentOption.name ?? "");

    // set selected manager in this componenet, as well as outside the component
    const onSelect = (manager) => {
        setSelected(manager.name);
        onManagerSelection(manager.id);
    } 

    // Render the DropDown component
    return (
        <Dropdown className="dropdown" >

            <Dropdown.Toggle className="dropdown-toggle" variant="success" id="dropdown-basic">
                {selected !== "" ? selected : "Select Manager"} 
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu">
                {options.map((option, index) => (
                    <Dropdown.Item 
                        key={index} eventKey={option.id}
                        onClick={() => onSelect(option)} 
                        active={option.name === selected}
                    >
                        {option.name || (option.first_name && option.last_name) || 'Unknown'}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>

        </Dropdown>
    );
}

export default DropDown;
