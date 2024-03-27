import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import axiosClient from "../../axios";
import AppTable from "./AppTable.component";

const ManagerAnalytics = ({currentManager}) => {
  const [selectedOption, setSelectedOption] = useState();
  const [grossSales, setGrossSales] = useState([]);
  const [mostSoldItem, setMostSoldItem] = useState([]);
  const options = [
    "Monthly gross sales",
    "Most sold item",
    "Busiest time of day",
  ]

  useEffect(() => {
    async function fetchData() {
      if (!currentManager) return;

      if (selectedOption === "Monthly gross sales") {
        const response = await axiosClient.get(`/managers/${currentManager.id}/gross-sales`);
        setGrossSales(response.data);
      }

      if (selectedOption === "Most sold item") {
        const response = await axiosClient.get(`/managers/${currentManager.id}/most-sold-item`);
        setMostSoldItem(response.data);
      }
    }

    fetchData().then();
  }, [currentManager, selectedOption]);

  const handleOptionChange = (e) => setSelectedOption(e.target.value)

  if (currentManager.id === undefined)
    return <h5 className="text-center">Select a manager</h5>

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

      {
        selectedOption === "Monthly gross sales" &&
        <AppTable tableHeaders={["Month", "Gross Sale"]}
                  tableRow={grossSales.map(sale => [sale.month, sale.grossSale])}/>
      }

      {
        selectedOption === "Most sold item" &&
        <AppTable tableHeaders={["Month", "Item", "Quantity"]}
                  tableRow={mostSoldItem.map(mostSold => [mostSold.month, mostSold.item, mostSold.amount])}/>
      }

    </>
  )
};

export default ManagerAnalytics;
