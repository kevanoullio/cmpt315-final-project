import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

/**
 * Function to render the DropDown component
 * @param {String} placeholder - String representing the placeholder text prior to user input
 * @param {Array} options - Array of objects representing the options
 * @param {Object} currentOption - Current object representing the current option
 * @param {Function} setFunction - Function to set the current option
 * @returns {JSX.Element} - The DropDown component
 */
const DropDown = ({ options, currentOption, onManagerSelection, onCustomerSelection }) => {
    // change selected manager to state var so it re
    const [selected, setSelected] = useState(currentOption.name ?? "");

    // set selected manager in this componenet, as well as outside the component
    const onSelectManager = (manager) => {
        setSelected(manager.name);
        onManagerSelection(manager.id);
    }

    // set selected customer in this componenet, as well as outside the component
    const onSelectCustomer = (customer) => {
        setSelected(customer.name);
        onCustomerSelection(customer.id);
    }

    // Render the DropDown component
    return (
        <Dropdown className="dropdown" >

            <Dropdown.Toggle className="dropdown-toggle" variant="success" id="dropdown-basic">
                {selected !== "" ? selected : onManagerSelection ? "Select Manager" : "Select Customer"}
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu">
                {options.map((option, index) => {
                    return onManagerSelection ?
                        (<Dropdown.Item
                            key={index} eventKey={option.id}
                            onClick={() => onSelectManager(option)}
                            active={option.name === selected}
                        >
                        {option.name || (option.first_name && option.last_name) || 'Unknown'}
                        </Dropdown.Item>
                    ) :
                        <Dropdown.Item
                            key={index} eventKey={option.id}
                            onClick={() => onSelectCustomer(option)}
                            active={option.name === selected}
                        >
                        {option.name || option.first_name + " " + option.last_name || 'Unknown'}
                        </Dropdown.Item>
                    }
                )}
            </Dropdown.Menu>

        </Dropdown>
    );
}

export default DropDown;
