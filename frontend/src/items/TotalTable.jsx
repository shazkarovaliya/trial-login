
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const TotalTable = ({ transactions }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Safely check for transactions and ensure it is an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Ensure all total_amount values are numbers and adjust for Expenses/Investments
  const formattedData = safeTransactions.map(row => ({
    category: row.category,
    total_amount: Number(row.total_amount)  // Convert to a number
  }));

  // Adjust total_amount for Expenses to be negative
  formattedData.forEach(row => {
    if (row.category === "Expense") {
      row.total_amount = -Math.abs(row.total_amount);  // Make it negative
    }
  });

  // Sort the data by category in a predefined order
  const sortedData = formattedData.sort((a, b) => {
    const order = ['Income', 'Expense'];
    return order.indexOf(a.category) - order.indexOf(b.category);
  });

  // Calculate the total amount across all transactions
  const totalAmount = sortedData.reduce((acc, row) => acc + row.total_amount, 0);

  // Handle row click to redirect to /report with category
  const handleRowClick = (category) => {
    navigate(`/category/${category}`); // Redirect to /report/{category}
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Total Amount</th>
        </tr>
      </thead>
      <tbody>
        {safeTransactions.length > 0 ? (
          sortedData.map((row, index) => (
            <tr key={index} onClick={() => handleRowClick(row.category)} style={{ cursor: 'pointer' }}>
              <td>{row.category}</td>
              <td>${row.total_amount ? row.total_amount.toFixed(2) : '0.00'}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2">No transactions available</td>
          </tr>
        )}
        {/* Add the "Total" row */}
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>${totalAmount.toFixed(2)}</strong></td>
        </tr>
      </tbody>
    </table>
  );
};

TotalTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      total_amount: PropTypes.number
    })
  ),
};

TotalTable.defaultProps = {
  transactions: [],
};

export default TotalTable;