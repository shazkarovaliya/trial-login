import React, { useState, useEffect } from 'react';
import NavBar from '../items/NavBar';

const Transfer = () => {
  const [formData, setFormData] = useState({
    date: '',
    fromAccount: '',
    toAccount: '',
    method: '',
    checkNumber: '',
    amount: '',
    memo: '',
  });

  const [accountOptions, setAccountOptions] = useState([]);

  // Fetch account options on component mount
  useEffect(() => {
    const fetchAccountOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/getBankOptions', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setAccountOptions(data.bankOptions || []);
        } else {
          console.error('Error fetching account options');
        }
      } catch (error) {
        console.error('Network error fetching account options:', error);
      }
    };

    fetchAccountOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Transfer recorded successfully!');
        setFormData({
          date: '',
          fromAccount: '',
          toAccount: '',
          method: '',
          checkNumber: '',
          amount: '',
          memo: '',
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Transfer failed'}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="main">
      <NavBar />
      <h2>Transfer Funds</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>From Account:</label>
          <select
            name="fromAccount"
            value={formData.fromAccount}
            onChange={handleChange}
            required
          >
            <option value="">Select Account</option>
            {accountOptions.map((account) => (
              <option key={account.id} value={account.bank}>
                {account.bank}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>To Account:</label>
          <select
            name="toAccount"
            value={formData.toAccount}
            onChange={handleChange}
            required
          >
            <option value="">Select Account</option>
            {accountOptions.map((account) => (
              <option key={account.id} value={account.bank}>
                {account.bank}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Transaction Method:</label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            required
          >
            <option value="">Select Method</option>
            <option value="transfer">Transfer</option>
            <option value="check">Check</option>
            <option value="online">Online</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        {formData.method === 'check' && (
          <div className="form-group">
            <label>Check Number:</label>
            <input
              type="text"
              name="checkNumber"
              value={formData.checkNumber}
              onChange={handleChange}
              required={formData.method === 'check'}
            />
          </div>
        )}
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Memo:</label>
          <input
            type="text"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            placeholder="Add a memo (optional)"
          />
        </div>
        <div className="form-group">
          <button type="submit">Submit Transfer</button>
        </div>
      </form>
    </div>
  );
};

export default Transfer;