import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import "./hoursWindow.styles.css";

/**
 * Function to render the menu item window component
 * @param {Boolean} showMenuItem - The boolean to show the checkout window
 * @param {Function} toggleMenuItem - The function to toggle the checkout window

 * @returns {JSX.Element} - The checkout window component
 */
const ChangeHoursWindow = ({ currentRestaurant, showHours, toggleHours, onSubmit }) => {
  // variables to hold the menu item attributes
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");

  const isValidTime = (time) => {
    // Regular expression to match the "hh:mm" format
    const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

    // Test the format
    if (regex.test(time)) {
      // Extract hours and minutes
      const parts = time.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);

      // Check the range of hours and minutes
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return true;
      }
    }

    return false;
  }

  /**
 * Converts my time string from 24h (as it is in the database) to 12h
 * @param {String} time - in 24h in format "hh:mm"
 * @returns time string in 21h format "hh:mm a/p"
 */
const tConvert = (time) => {
  // split into hours/mins
  time = time.toString();
  let times = time.split(":")
  // set default ampm as AM
  let ampm = " AM";

  // if > 12, set PM and subtract 12
  if (times[0] > 12) {
    ampm = " PM"
    times[0] -= 12;
  } else if (times[0] == 12) {
    // if equal to 12 set pm, dont remove 12 (noon)
    ampm = " PM"
  } else if (times[0] == 0) {
    // if midnight, we have to add 12 manually
    times[0] = 12;
  }

  return times[0] + ":" + times[1] + ampm; // return adjusted time or original string
}

  const removeLeadingZeroes = (time) => {
    // First, split the time string by the colon to separate hours and minutes
    let [hours, minutes] = time.split(':');

    // Parse the hours string to an integer, which automatically removes leading zeros
    hours = parseInt(hours, 10);

    // Reconstruct the time string. This step converts hours back to a string without leading zeros.
    // We're not changing minutes, so it will preserve any leading zero as required.
    const adjustedTime = `${hours}:${minutes}`;

    return adjustedTime;
  }

  // Function to submit menu item (changes or add new menu item)
  const onSubmitButtonClick = () => {
    const hoursAttributes = {
      "open": removeLeadingZeroes(open),
      "close": removeLeadingZeroes(close)
    };
    onSubmit(hoursAttributes);

    // Close the window
    toggleHours();
  };

  // Function to cancel adding or editing menu item
  const onCancel = () => {
    // Close the window
    toggleHours();
  };

  return (
    <Modal
      className="menu-item-window"
      show={showHours}
      onHide={toggleHours}
      size="lg"
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Restaurant Hours</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="menu-item-container">
          <section className="menu-item-left-section">
            {currentRestaurant.storeHours ? (
              <p>{`Current Hours: ${tConvert(currentRestaurant?.storeHours?.open)} to ${tConvert(currentRestaurant?.storeHours?.close)}`}</p>
            ) : (
              <p>Hours currently not set, this means open 24/7</p>
            )}

            <Form>
              <Form.Group controlId="form-name">
                <div className="timeHolder">
                  <Form.Label className="timeText">Open time</Form.Label>
                  <Form.Control
                    className="timeChoice"
                    type="time"
                    placeholder="hh:mm in 24 hour time"
                    value={open}
                    onChange={(e) => setOpen(e.target.value)}
                  />
                  <Form.Label className="timeText">Close time</Form.Label>
                  <Form.Control
                    className="timeChoice"
                    type="time"
                    placeholder="hh:mm in 24 hour time"
                    value={close}
                    onChange={(e) => setClose(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Form>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="cancel-button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="submit-button"
          variant="success"
          onClick={onSubmitButtonClick}
          // disable if no changes during edit or if not all fields filled out during add
          disabled={!isValidTime(open) || !isValidTime(close)}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ChangeHoursWindow;
