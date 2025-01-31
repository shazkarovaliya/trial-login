import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import NavBar from '../items/NavBar';

const ReportCategory = () => {
  const { category } = useParams(); // Get the category from the URL
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0); // For the total amount
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch
    setError(null); // Reset any previous errors

    fetch(/*`https://vamsivemula.art/category/${category}`*/ `http://localhost:3001/category/${category}`, {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // Ensure amount is a number
          const transactions = data.map(transaction => ({
            ...transaction,
            amount: parseFloat(transaction.total), // Convert amount to a number
          }));

          setFilteredTransactions(transactions); // Set the fetched transactions
          const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0); // Calculate total
          setTotalAmount(total);
        } else {
          setFilteredTransactions([]); // No data found for this category
        }
      })
      .catch((error) => {
        setError('Failed to fetch transactions');
        console.error("Error fetching transactions:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the fetch completes
      });
  }, [category]);

  // Handle row click to redirect to ReportDescription page with description as the category
  const handleRowClick = (description) => {
    navigate(`/description/${description}`); // Redirect to /report/:description
  };

  return (
    <div className='main'>
      <NavBar />
      <h2>Report for Category: {category}</h2>

      {loading && <p>Loading...</p>} {/* Show loading indicator */}
      {error && <p>{error}</p>} {/* Show error message if there's an issue fetching data */}

      {filteredTransactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((row, index) => (
              <tr key={index} onClick={() => handleRowClick(row.description)}>
                <td>{row.description}</td>
                <td>${row.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data found for this category.</p> // Display message if no transactions found
      )}

      {totalAmount !== 0 && (
        <div>
          <h3>Total for {category}: ${totalAmount.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default ReportCategory;