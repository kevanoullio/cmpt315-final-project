import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import BootstrapTable from "react-bootstrap/Table";
import axiosClient from "../../axios";

const ManagerAnalytics = ({currentManager}) => {
  const [selectedOption, setSelectedOption] = useState();
  const [grossSales, setGrossSales] = useState([]);
  const options = [
    "Monthly gross sales",
    "Most sold item",
    "Busiest time of day",
  ]

  useEffect(() => {
    async function getGrossSales() {
      if (!currentManager) return;
      if (selectedOption === "Monthly gross sales") {
        console.log("Manager: ", currentManager)
        const response = await axiosClient.get(`/managers/${currentManager.id}/gross-sales`);
        setGrossSales(response.data);
      }
    }

    getGrossSales().then();
  }, [currentManager, selectedOption]);

  const handleOptionChange = (e) => setSelectedOption(e.target.value)

  if (currentManager.id === undefined)
    return <h5 className="text-center">Select a manager</h5>

  let finalView = null;
  if (selectedOption === "Monthly gross sales") {
    finalView = (
      <BootstrapTable className="bootstrap-table" striped bordered hover>
        <thead className="custom-header">
        <tr>
          <th>Month</th>
          <th>Gross Sale</th>
        </tr>
        </thead>
        <tbody>
        {
          grossSales.map((sale, index) => (
            <tr key={index}>
              <td>{sale.month}</td>
              <td>{sale.grossSale}</td>
            </tr>
          ))
        }
        </tbody>
      </BootstrapTable>
    )
  }
  return (
    <>
      <div className="mb-3">
        <Form.Select onChange={handleOptionChange}>
          <option>Select One</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Form.Select>
      </div>

      {finalView}
    </>
  )
};

export default ManagerAnalytics;
