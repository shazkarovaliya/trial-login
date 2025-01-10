// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const BankTotalTable = () => {
//   const [bankTotals, setBankTotals] = useState([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // Use the navigate hook for redirection

//   useEffect(() => {
//     const fetchBankTotals = async () => {
//       try {
//         const response = await fetch('https://vamsivemula.art/totalByBank', { 
//           method: 'GET', 
//           credentials: 'include',
//         });
//         if (!response.ok) throw new Error('Failed to fetch bank totals');
        
//         const data = await response.json();
//         setBankTotals(data.map(row => ({
//           account: row.account,
//           total: parseFloat(row.total || 0) // Ensure total is a number
//         })));
//       } catch (error) {
//         console.error('Error fetching bank totals:', error);
//         setError('Error fetching bank totals');
//       }
//     };

//     fetchBankTotals();
//   }, []);

//   const handleRowClick = (account) => {
//     // Navigate to the bank report for the clicked account
//     navigate(`/report/bank/${account}`);
//   };

//   return (
//     <div>
//       <h2>Totals by Account</h2>
//       {error ? <p>{error}</p> : (
//         <table>
//           <thead>
//             <tr>
//               <th>Account</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bankTotals.map((row, index) => (
//               <tr key={index} onClick={() => handleRowClick(row.account)}>
//                 <td>{row.account}</td>
//                 <td>${row.total.toFixed(2)}</td> {/* Safely convert total to a fixed decimal format */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default BankTotalTable;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BankTotalTable = () => {
  const [bankTotals, setBankTotals] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use the navigate hook for redirection

  useEffect(() => {
    const fetchBankTotals = async () => {
      try {
        const response = await fetch('https://vamsivemula.art/totalByBank', { 
          method: 'GET', 
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch bank totals');
        
        const data = await response.json();
        setBankTotals(data.map(row => {
          let total = parseFloat(row.total || 0); // Ensure total is a number

          // Check if the category is "Paid-Out" and subtract the total if true
          if (row.category === 'Paid-Out') {
            total = -Math.abs(total); // Make the total negative for "Paid-Out" category
          }

          return {
            account: row.account,
            category: row.category,  // Including category in the final object
            total
          };
        }));
      } catch (error) {
        console.error('Error fetching bank totals:', error);
        setError('Error fetching bank totals');
      }
    };

    fetchBankTotals();
  }, []);

  const handleRowClick = (account) => {
    // Navigate to the bank report for the clicked account
    navigate(`/report/bank/${account}`);
  };

  return (
    <div>
      <h2>Totals by Account</h2>
      {error ? <p>{error}</p> : (
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bankTotals.map((row, index) => (
              <tr key={index} onClick={() => handleRowClick(row.account)}>
                <td>{row.account}</td>
                <td>${row.total.toFixed(2)}</td> {/* Safely convert total to a fixed decimal format */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BankTotalTable;