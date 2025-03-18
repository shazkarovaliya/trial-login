import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../items/NavBar';
import Dropdown from '../items/Dropdown';

const Settings = () => {
  const [formData, setFormData] = useState({ dd_option: '' });
  const [bankFormData, setBankFormData] = useState({ bank: '', accountType: '', beginningBalance: '' });
  const [td_options, set_td_options] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankFormData({ ...bankFormData, [name]: value });
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://vamsivemula.art/settings', { method: 'GET' });
      const data = await response.json();
      set_td_options(data.td_options || []);
      setMessage(data.message || '');
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data');
    }
  };

  const fetchBankOptions = async () => {
    try {
      const response = await fetch('https://vamsivemula.art/getBankOptions', { method: 'GET' });
      const data = await response.json();
      setBankOptions(data.bankOptions || []);
      setMessage(data.message || '');
    } catch (error) {
      console.error('Error fetching bank options:', error);
      setMessage('Error fetching bank options');
    }
  };

  useEffect(() => {
    fetchData();
    fetchBankOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://vamsivemula.art/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      setFormData({ dd_option: '' });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('https://vamsivemula.art/addBankOptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bankFormData),
      });
      setBankFormData({ bank: '', accountType: '', beginningBalance: '' });
      fetchBankOptions(); // Refresh data
    } catch (error) {
      console.error('Error submitting bank form:', error);
    }
  };

  const handleEdit = async (id, newValue, fieldName, endpoint) => {
    try {
      const response = await fetch(`https://vamsivemula.art/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [fieldName]: newValue }),
      });

      if (response.ok) {
        // Refresh data based on the endpoint
        endpoint === 'settings' ? fetchData() : fetchBankOptions();
        setMessage('Option updated successfully!');
      } else {
        setMessage('Error updating option');
      }
    } catch (error) {
      console.error('Error updating option:', error);
      setMessage('Error updating option');
    }
  };

  const handleDelete = async (id, endpoint, stateUpdater) => {
    try {
      await fetch(`https://vamsivemula.art/${endpoint}/${id}`, { method: 'DELETE', credentials: 'include' });
      stateUpdater((prev) => prev.filter((option) => option.id !== id));
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  return (
    <div className="main">
      <NavBar />
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="dd_option">Enter Description Option:</label>
          <input type="text" name="dd_option" value={formData.dd_option} onChange={handleChange} />
          <button type="submit">Add</button>
        </form>
      </div>

      <Dropdown
        title="Description Options"
        data={td_options}
        onDelete={(id) => handleDelete(id, 'settings', set_td_options)}
        onEdit={(id, newValue) => handleEdit(id, newValue, 'dd_option', 'settings')}
      />

      {/* <div>
        <form onSubmit={handleBankSubmit}>
          <label htmlFor="bank">Enter Account Option:</label>
          <input type="text" name="bank" value={bankFormData.bank} onChange={handleBankChange} />
          <button type="submit">Add</button>
        </form>
      </div> */}

      <div>
        <form onSubmit={handleBankSubmit}>
          <label htmlFor="bank">Enter Account Option:</label>
          <input type="text" name="bank" value={bankFormData.bank} onChange={handleBankChange} />

          <label htmlFor="accountType">Select Account Type:</label>
          <select name="accountType" value={bankFormData.accountType} onChange={handleBankChange}>
            <option value="">--Select Type--</option>
            <option value="General">General</option>
            <option value="Loan">Loan</option>
            <option value="Cash Flow">Cash Flow</option>
          </select>

          <label htmlFor="beginningBalance">Beginning Balance:</label>
          <input type="number" name="beginningBalance" value={bankFormData.beginningBalance} onChange={handleBankChange} />

          <button type="submit">Add</button>
        </form>
      </div>


      <Dropdown
        title="Bank Options"
        data={bankOptions}
        onDelete={(id) => handleDelete(id, 'getBankOptions', setBankOptions)}
        onEdit={(id, newValue) => handleEdit(id, newValue, 'bank', 'getBankOptions')}
      />
    </div>
  );
};

export default Settings;