import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../items/NavBar';

const ReportDescription = () => {
  const { description } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [tdOptions, setTdOptions] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchTdOptions();
    fetchBankOptions();
  }, [description]);

  const fetchTransactions = () => {
    fetch(`https://vamsivemula.art/description/${description}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        const transactions = data.transactions.map((transaction) => ({
          ...transaction,
          adjusted_amount: parseFloat(transaction.adjusted_amount),
        }));
        setTransactions(transactions || []);
        setFilteredTransactions(transactions || []);

        const totalAmount = transactions.reduce(
          (sum, transaction) => sum + transaction.adjusted_amount,
          0
        );
        setTotal(totalAmount);
      })
      .catch((error) => {
        setError('Failed to fetch transactions. Please ensure you are logged in.');
        console.error('Error fetching transactions:', error);
      });
  };

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
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setBankOptions(data.bankOptions || []);
      } else {
        console.error('Error fetching bank options');
      }
    } catch (error) {
      console.error('Error fetching bank options:', error);
    }
  };

  const handleDeleteClick = (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    fetch(`https://vamsivemula.art/transactions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
        }
        fetchTransactions();
      })
      .catch((error) => {
        console.error('Error deleting transaction:', error);
      });
  };

  const handleEditClick = (row) => {
    setEditingRow(row.id);
    setFormData({ ...row });
  };

  const handleSaveClick = () => {
    if (!editingRow) {
      console.error('Error: No transaction ID found for editing.');
      return;
    }

    fetch(`https://vamsivemula.art/transactions/${editingRow}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
        }
        fetchTransactions();
        setEditingRow(null);
        setFormData({});
      })
      .catch((error) => {
        console.error('Error updating transaction:', error);
      });
  };

  const handleCancelClick = () => {
    setEditingRow(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const filterByDate = () => {
  //   const filtered = transactions.filter((transaction) => {
  //     const transactionDate = new Date(transaction.date);
  //     const isAfterStartDate = startDate ? transactionDate >= new Date(startDate) : true;
  //     const isBeforeEndDate = endDate ? transactionDate <= new Date(endDate) : true;
  //     return isAfterStartDate && isBeforeEndDate;
  //   });

  //   setFilteredTransactions(filtered);

  //   const totalAmount = filtered.reduce(
  //     (sum, transaction) => sum + transaction.adjusted_amount,
  //     0
  //   );
  //   setTotal(totalAmount);
  // };

  const filterByDate = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      
      // Normalize start date and end date to remove timezone shifts
      const start = startDate ? new Date(startDate + "T00:00:00") : null;
      const end = endDate ? new Date(endDate + "T23:59:59") : null;
  
      const isAfterStartDate = start ? transactionDate >= start : true;
      const isBeforeEndDate = end ? transactionDate <= end : true;
  
      return isAfterStartDate && isBeforeEndDate;
    });
  
    setFilteredTransactions(filtered);
  
    const totalAmount = filtered.reduce(
      (sum, transaction) => sum + transaction.adjusted_amount,
      0
    );
    setTotal(totalAmount);
  };  

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div className="main">
      <NavBar />
      <h2>Report for {description}</h2>
      <div className="date-filters">
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </label>
        <button onClick={filterByDate}>Filter</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Account</th>
            <th>Amount</th>
            <th>Memo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((row) => (
              <tr key={row.id}>
                {editingRow === row.id ? (
                  <>
                    <td>
                      <input
                        type="date"
                        name="date"
                        value={new Date(formData.date).toISOString().substring(0, 10)}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a category</option>
                        <option value="Paid-In">Paid-In</option>
                        <option value="Paid-Out">Paid-Out</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a description</option>
                        {tdOptions.map(option => (
                          <option key={option.id} value={option.dd_option}>{option.dd_option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="account"
                        value={formData.account}
                        onChange={handleInputChange}
                      >
                        <option value="">Select an account</option>
                        {bankOptions.map(option => (
                          <option key={option.id} value={option.bank}>{option.bank}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="memo"
                        value={formData.memo}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={handleCancelClick}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{new Date(row.date).toLocaleDateString('en-US')}</td>
                    <td>{row.category}</td>
                    <td>{row.description || 'N/A'}</td>
                    <td>{row.account}</td>
                    <td>${row.adjusted_amount.toFixed(2)}</td>
                    <td>{row.memo || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleEditClick(row)}>Edit</button>
                      <button onClick={() => handleDeleteClick(row.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No data found for this description.</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>Total for {description}: ${total.toFixed(2)}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ReportDescription;