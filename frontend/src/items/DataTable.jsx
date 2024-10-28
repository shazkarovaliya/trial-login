import React from 'react';

const DataTable = ({ transactions }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((row, index) => (
            <tr key={index}>
              <td>{row.id}</td>
              <td>{row.date}</td>
              <td>{row.category}</td>
              <td>{row.description}</td>
              <td>{row.amount}</td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="5">No transactions available</td></tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;
