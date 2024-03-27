import BootstrapTable from "react-bootstrap/Table";
import React from "react";


/**
 * Reusable component for rendering a table
 * @param tableHeaders Array of table headers
 * @param tableRow An array of arrays representing the rows of the table
 * @returns {JSX.Element} the newly created table
 * @constructor
 */
const AppTable = ({tableHeaders, tableRow}) => {
  console.log("Table Headers: ", tableHeaders)
  console.log("Table Row: ", JSON.stringify(tableRow))
  return <BootstrapTable className="bootstrap-table" striped bordered hover>
    <thead className="custom-header">
    <tr>
      {
        tableHeaders.map((tableHeader, index) => (
          <th key={index}>{tableHeader}</th>
        ))
      }
    </tr>
    </thead>
    <tbody>
    {
      tableRow.map((row, index) => (
        <tr key={index}>
          {
            row.map((cell, index) => (
              <td key={index}>{cell}</td>
            ))
          }
        </tr>
      ))
    }
    </tbody>
  </BootstrapTable>
};

export default AppTable;
