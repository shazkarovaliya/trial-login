import React from 'react';

const Dropdown = ({ title, data }) => {
  return (
    <div>
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>{title}</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                <td>{row.dd_option || row.bank}</td> {/* Check whether to display the description or bank */}
              </tr>
            ))
          ) : (
            <tr><td colSpan="1">No options available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dropdown;