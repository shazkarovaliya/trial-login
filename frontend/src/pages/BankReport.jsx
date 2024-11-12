import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NavBar from '../items/NavBar';

const BankReport = () => {
  const { bank } = useParams(); // Get the bank parameter from the URL
  const [bankReport, setBankReport] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBankReport = async () => {
      try {
        const response = await fetch(`http://localhost:3001/report/bank/${bank}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bank report');
        }
        const data = await response.json();
        const sortedTransactions = (data.report || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        setBankReport(sortedTransactions); // Assuming the response contains a 'report' field
      } catch (error) {
        setError('Failed to fetch bank report');
        console.error('Error fetching bank report:', error);
      }
    };

    fetchBankReport();
  }, [bank]);

  return (
    <div className='main'>
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
                <td>{row.category}</td>
                <td>{row.description}</td>
                <td>${row.amount.toFixed(2)}</td>
                <td>{row.memo}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data found for this bank.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BankReport;