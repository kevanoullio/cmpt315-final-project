import Table from "react-bootstrap/Table";
import React from "react";


/**
 * Reusable component for rendering a table
 * @param tableHeaders Array of table headers
 * @param tableRow An array of arrays representing the rows of the table
 * @returns {JSX.Element} the newly created table
 * @constructor
 */
const AppTable = ({tableHeaders, tableRow}) => {
  return <Table className="bootstrap-table" striped bordered hover>
    <thead className="custom-header">
    <tr>
      {
        tableHeaders.map((tableHeader, index) => (
          <th key={index} className="text-center">{tableHeader}</th>
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
              <td key={index} className="text-center">{cell}</td>
            ))
          }
        </tr>
      ))
    }
    </tbody>
  </Table>
};

export default AppTable;
