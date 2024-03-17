import React, { useState } from "react";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import Form from "react-bootstrap/Form";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";

const DateTimePicker = ({ onChange, value, disableClock, minDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false}));
  const [asap, setAsap] = useState(false);

  return (
    <div>
      <h4><u>Pickup Date & Time</u></h4>
      <p>Select a pickup date:<br />
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)} minDate={new Date()}
        disabled={asap}
      />
      </p>
      <p>Select a pickup time:<br />
      <TimePicker
        onChange={setTime} value={time}
        disableClock={true}
        disabled={asap}
      />
      </p>
      <Form>
        {["checkbox"].map((type) => (
          <div key={type} className="mb-3">
            <Form.Check
              className="checkbox-asap"
              type={type}
              id={`asap-${type}`}
              label="ASAP"
              onChange={() => setAsap(!asap)}
            />
          </div>
        ))}
      </Form>
      {/* const dateTime = new Date(`${startDate.toISOString().split('T')[0]}T${time}`); */}
    </div>
  );
};

export default DateTimePicker;
