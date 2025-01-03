import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../items/NavBar';

const BankReport = () => {
  const { bank } = useParams();
  const [bankReport, setBankReport] = useState([]);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);  // State to store the total amount
  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    const fetchBankReport = async () => {
      try {
        const response = await fetch(`http://localhost:3001/report/bank/${bank}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bank report');
        }
        const data = await response.json();
        const sortedTransactions = (data.report || []).sort((a, b) => new Date(b.date) - new Date(a.date));

        // Adjust transactions and calculate the total
        const adjustedTransactions = sortedTransactions.map((row) => {
          // Convert amount to number, ensuring it's valid
          row.amount = Number(row.amount);

          // If it's an Expense, Investment, or Paid-Out, make it negative
          if (row.category === 'Expense' || row.category === 'Investment' || row.category === 'Paid-Out') {
            row.amount = -Math.abs(row.amount);
          }

          return row;
        });

        setBankReport(adjustedTransactions);

        // Calculate the total
        const total = adjustedTransactions.reduce((acc, row) => acc + (isNaN(row.amount) ? 0 : row.amount), 0);
        setTotalAmount(total);

      } catch (error) {
        setError('Failed to fetch bank report');
        console.error('Error fetching bank report:', error);
      }
    };

    fetchBankReport();
  }, [bank]);

  // Handle description click to redirect to ReportDescription page with description as the row
  const handleDescriptionClick = (description) => {
    navigate(`/description/${description}`); // Redirect to /report/:description
  };

  // Handle category click to redirect to ReportCategory page with category as the row
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`); // Redirect to /report/:description
  };

  return (
    <div className="main">
      <NavBar />
      <h2>Bank Report for {bank}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Memo</th>
          </tr>
        </thead>
        <tbody>
          {bankReport.length > 0 ? (
            bankReport.map((row, index) => (
              <tr key={index}>
                <td>{new Date(row.date).toLocaleDateString('en-US')}</td>
                <td onClick={() => handleCategoryClick(row.category)}>{row.category}</td>
                <td onClick={() => handleDescriptionClick(row.description)}>{row.description}</td>
                {/* Ensure amount is a valid number before calling toFixed */}
                <td>${!isNaN(row.amount) ? row.amount.toFixed(2) : '0.00'}</td>
                <td>{row.memo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data found for this bank.</td>
            </tr>
          )}
          {/* Add the Total Row */}
          <tr>
            <td colSpan="4"><strong>Total:</strong></td>
            <td><strong>${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BankReport;