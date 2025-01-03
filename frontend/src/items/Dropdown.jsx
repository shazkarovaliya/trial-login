import React, { useState } from 'react';
import '../css/Settings.css';

const Dropdown = ({ title, data, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableOption, setEditableOption] = useState(null);
  const [editableValue, setEditableValue] = useState('');
  const [editableFieldName, setEditableFieldName] = useState('');

  const handleEdit = (option, fieldName) => {
    setIsEditing(true);
    setEditableOption(option);
    setEditableValue(option[fieldName]);
    setEditableFieldName(fieldName);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3001/editOption/${editableOption.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          [editableFieldName]: editableValue,
          originalValue: editableOption[editableFieldName],
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        onEdit(); // Refresh data by calling parent function
      } else {
        console.error('Error updating option');
      }
    } catch (error) {
      console.error('Error updating option:', error);
    }
  };

  return (
    <div className="dropdown-container">
      <h3>{title}</h3>
      <ul className="dropdown-list">
        {data.map((option) => (
          <li key={option.id} className="dropdown-item">
            {isEditing && editableOption.id === option.id ? (
              <input
                type="text"
                className="edit-input"
                value={editableValue}
                onChange={(e) => setEditableValue(e.target.value)}
              />
            ) : (
              <span>{option.dd_option || option.bank}</span>
            )}
            <div className="button-container">
              {isEditing && editableOption.id === option.id ? (
                <button onClick={handleSaveEdit} className="save-button">Save</button>
              ) : (
                <button
                  onClick={() => handleEdit(option, option.dd_option ? 'dd_option' : 'bank')}
                  className="edit-button"
                >
                  Edit
                </button>
              )}
              <button onClick={() => onDelete(option.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;