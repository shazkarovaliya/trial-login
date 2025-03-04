import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../items/NavBar';

import '../css/Transfer.css';

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

  const [loanFormData, setLoanFormData] = useState({
    date: '',
    fromAccount: '',
    toAccount: '',
    method: '',
    checkNumber: '',
    amount: '',
    memo: '',
  });

  const [generalFormData, setGeneralFormData] = useState({
    date: '',
    fromAccount: '',
    toAccount: '',
    method: '',
    checkNumber: '',
    amount: '',
    memo: '',
  });

  const [transferFormData, setTransferFormData] = useState({
    date: '',
    fromAccount: '',
    toAccount: '',
    method: '',
    checkNumber: '',
    amount: '',
    memo: '',
  });

  const [accountOptions, setAccountOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [tdOptions, setTdOptions] = useState([]); // State to hold description options
  const [bank, setBankOptions] = useState([]); // State to hold bank options

  useEffect(() => {
    const fetchAccountOptions = async () => {
      try {
        const response = await fetch('https://vamsivemula.art/getBankOptions', {
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

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoanChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchTdOptions = async () => {
      try {
        const response = await fetch('https://vamsivemula.art/settings', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setTdOptions(data.td_options || []);
        } else {
          console.error('Failed to fetch TDOptions');
        }
      } catch (error) {
        console.error('Error fetching TDOptions:', error);
      }
    };

    const fetchBankOptions = async () => {
      try {
        const response = await fetch('https://vamsivemula.art/getBankOptions', {
          method: 'GET',
          credentials: 'include', // Include cookies to send the session
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Bank options data:', data); // Log to check if the response contains bank options
          setMessage(data.message);
          setBankOptions(data.bankOptions || []); // Ensure this is correctly populated
        } else {
          console.error('Error fetching bank options');
          setMessage('Error fetching bank options');
        }
      } catch (error) {
        console.error('Error fetching bank options:', error);
        setMessage('Error fetching bank options');
      }
    };

    fetchTdOptions();
    fetchBankOptions();
  }, []);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://vamsivemula.art/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Form submission successful:', result);
        window.location.reload();
      } else {
        console.error('Form submission failed:', result);
      }
    } catch (error) {
      console.error('Database insertion error details:', error.message);
      console.error('Error:', error);
    }
  };

  const handleLoanSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://vamsivemula.art/loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Form submission successful:', result);
        window.location.reload();
      } else {
        console.error('Form submission failed:', result);
      }
    } catch (error) {
      console.error('Database insertion error details:', error.message);
      console.error('Error:', error);
    }
  }

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://vamsivemula.art/general', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Form submission successful:', result);
        window.location.reload();
      } else {
        console.error('Form submission failed:', result);
      }
    } catch (error) {
      console.error('Database insertion error details:', error.message);
      console.error('Error:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://vamsivemula.art/transfer', {
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
      <h2 className="section-header">Add Transaction</h2>
      <form className="transaction-form" onSubmit={handleTransactionSubmit}>
        <div className="form-field">
          <label htmlFor="date">Date:</label>
          <input type="date" name="date" required onChange={handleTransactionChange} />
        </div>
        <div className="form-field">
          <label htmlFor="item-name">Category:</label>
          <select name="category" id="category" required onChange={handleTransactionChange}>
            <option value="">Select a category</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="description">Description:</label>
          <select name="description" required onChange={handleTransactionChange}>
            <option value="">Select a description</option>
            {tdOptions.map((option) => (
              <option key={option.id} value={option.dd_option}>
                {option.dd_option}
              </option>
            ))}
          </select>
          <a href="/settings" className="add-link">
            <FontAwesomeIcon icon={faPlus} />
          </a>
        </div>
        <div className="form-field">
          <label htmlFor="account">Account:</label>
          <select name="account" required onChange={handleTransactionChange}>
            <option value="">Select an account</option>
            {bank.map((option) => (
              <option key={option.id} value={option.bank}>
                {option.bank}
              </option>
            ))}
          </select>
          <a href="/settings" className="add-link">
            <FontAwesomeIcon icon={faPlus} />
          </a>
        </div>
        <div className="form-field">
          <label htmlFor="transmeth">Transaction Method:</label>
          <select name="transmeth" id="transmeth" required onChange={handleTransactionChange}>
            <option value="">Select a transaction method</option>
            <option value="Cash">Cash</option>
            <option value="EFT">EFT</option>
            <option value="Check">Check</option>
            <option value="Withdrawal">Withdrawal</option>
          </select>
        </div>
        {formData.transmeth === 'Check' && (
          <div className="form-field">
            <label htmlFor="checkNum">Enter Check Number:</label>
            <input
              type="text"
              name="checkNum"
              onChange={handleTransactionChange}
              value={formData.checkNum}
            />
          </div>
        )}
        <div className="form-field">
          <label htmlFor="amount">Enter Amount:</label>
          <input type="number" name="amount" step="0.01" required onChange={handleTransactionChange} />
        </div>
        <div className="form-field">
          <label htmlFor="memo">Enter Memo:</label>
          <input type="text" name="memo" onChange={handleTransactionChange} />
        </div>
        <div className="form-action">
          <input id="submit" type="submit" />
        </div>
      </form>

      <h2 className="section-header">Loan Transactions</h2>
      <form className="transaction-form" onSubmit={handleLoanSubmit}>
        <div className="form-field">
          <label htmlFor="date">Date:</label>
          <input type="date" name="date" value={loanFormData.date} onChange={handleLoanChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="item-name">Payment Type:</label>
          <select name="payment" id="payment" required onChange={handleLoanChange}>
            <option value="">Select a payment type:</option>
            <option value="Monthly">Monthly Payment</option>
            <option value="Interest Free">Interest Free</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="account">Account:</label>
          <select name="account" required onChange={handleTransactionChange}>
            <option value="">Select an account</option>
            {bank.map((option) => (
              <option key={option.id} value={option.bank}>
                {option.bank}
              </option>
            ))}
          </select>
          <a href="/settings" className="add-link">
            <FontAwesomeIcon icon={faPlus} />
          </a>
        </div>
        <div className="form-field">
          <label htmlFor="amount">Enter Amount:</label>
          <input type="number" name="amount" value={loanFormData.amount} onChange={handleTransactionChange} required min="0" step="0.01" placeholder="Amount" />
        </div>
        <div className="form-action">
          <input id="submit" type="submit" />
        </div>
      </form>

      <h2 className="section-header">General Transactions</h2>
      <form className="transaction-form" onSubmit={handleGeneralSubmit}>
        <div className="form-field">
          <label htmlFor="date">Date:</label>
          <input type="date" name="date" value={generalFormData.date} onChange={handleGeneralChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="item-name">Category:</label>
          <select name="category" id="category" required onChange={handleGeneralChange}>
            <option value="">Select a category</option>
            <option value="Paid-In">Paid-In</option>
            <option value="Paid-Out">Paid-Out</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="account">Account:</label>
          <select name="account" required onChange={handleGeneralChange} value={generalFormData.method}>
            <option value="">Select an account</option>
            {bank.map((option) => (
              <option key={option.id} value={option.bank}>
                {option.bank}
              </option>
            ))}
          </select>
          <a href="/settings" className="add-link">
            <FontAwesomeIcon icon={faPlus} />
          </a>
        </div>
        <div className="form-field">
          <label htmlFor="amount">Enter Amount:</label>
          <input type="number" name="amount" value={generalFormData.amount} onChange={handleGeneralChange} required min="0" step="0.01" placeholder="Amount" />
        </div>
        <div className="form-action">
          <input id="submit" type="submit" />
        </div>
      </form>

      <h2 className="section-header">Transfer Funds</h2>
      <form className="transfer-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>From Account:</label>
          <select
            name="fromAccount"
            value={transferFormData.fromAccount}
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
        <div className="form-field">
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
        <div className="form-field">
          <label>Transaction Method:</label>
          <select
            name="method"
            value={transferFormData.method}
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
          <div className="form-field">
            <label>Check Number:</label>
            <input
              type="text"
              name="checkNumber"
              value={transferFormData.checkNumber}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-field">
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={transferFormData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-field">
          <label>Memo:</label>
          <input
            type="text"
            name="memo"
            value={transferFormData.memo}
            onChange={handleChange}
            placeholder="Add a memo (optional)"
          />
        </div>
        <div className="form-action">
          <button type="submit">Submit Transfer</button>
        </div>
      </form>
    </div>
  );
};

export default Transfer;