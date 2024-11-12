// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NavBar from '../items/NavBar';
// import Dropdown from '../items/Dropdown';

// const Settings = () => {
//   const [formData, setFormData] = useState({ dd_option: '' });
//   const [bankFormData, setBankFormData] = useState({ bank: '' });
//   const [td_options, set_td_options] = useState([]);
//   const [bankOptions, setBankOptions] = useState([]); // New state to store BankOptions
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleBankChange = (e) => {
//     const { name, value } = e.target;
//     setBankFormData({
//       ...bankFormData,
//       [name]: value,
//     });
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:3001/settings', {
//           method: 'GET',
//           credentials: 'include',
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setMessage(data.message);
//           set_td_options(data.td_options || []);
//         } else {
//           const errorText = await response.text();
//           setMessage(`Error: ${errorText || 'Unauthorized access'}`);
//         }
//       } catch (error) {
//         console.error('Network or unexpected error:', error);
//         setMessage(`Network or unexpected error: ${error.message}`);
//       }
//     };

//     fetchData();

//     // Fetch BankOptions data
//     const fetchBankOptions = async () => {
//       try {
//         const response = await fetch('http://localhost:3001/getBankOptions', {
//           method: 'GET',
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setBankOptions(data.bankOptions || []);
//         } else {
//           console.error('Error fetching bank options');
//         }
//       } catch (error) {
//         console.error('Error fetching bank options:', error);
//       }
//     };

//     fetchBankOptions(); // Call the fetchBankOptions function on component mount
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:3001/settings', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         console.log('Form submission successful:', result);
//         window.location.reload();
//       } else {
//         console.error('Form submission failed:', result);
//       }
//     } catch (error) {
//       console.error('Database insertion error details:', error.message);
//       console.error('Error:', error);
//     }
//   };

//   const handleBankSubmit = async (e) => {
//     e.preventDefault(); // Prevent the page from refreshing
    
//     try {
//       const response = await fetch('http://localhost:3001/addBankOption', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ bank: bankFormData.bank }), // Use the user input from the form state
//       });
  
//       const data = await response.json();
//       console.log(data); // Log the response from the server
//       // Optionally, handle the response, like resetting the form or displaying a success message
//       if (response.ok) {
//         setMessage('Bank option added successfully!');
//         setBankFormData({ bank: '' }); // Reset the form
//       } else {
//         setMessage('Error adding bank option');
//       }
//     } catch (error) {
//       console.error('Error submitting the form:', error);
//       setMessage('Error submitting form');
//     }
//   };  

//   const handleBackToDashboard = () => {
//     navigate('/dashboard');
//   };

//   return (
//     <div className="main">
//       <NavBar />
//       <div>
//         <form onSubmit={handleSubmit}>
//           <div className="option">
//             <label htmlFor="name">Enter Description Option:</label>
//             <input
//               type="text"
//               name="dd_option"
//               value={formData.dd_option}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="submit">
//             <input type="submit" />
//           </div>
//         </form>
//       </div>
//       <button onClick={handleBackToDashboard} style={{ marginTop: '20px' }}>
//         Back to Dashboard
//       </button>
//       <Dropdown td_options={td_options} bankOptions={bankOptions} /> {/* Pass both td_options and bankOptions */}
//       <div>
//         <form onSubmit={handleBankSubmit}>
//           <div className="option">
//             <label htmlFor="name">Enter Bank Option:</label>
//             <input
//               type="text"
//               name="bank"
//               value={bankFormData.bank}
//               onChange={handleBankChange}
//             />
//           </div>
//           <div className="submit">
//             <input type="submit" />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Settings;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../items/NavBar';
import Dropdown from '../items/Dropdown';

const Settings = () => {
  const [formData, setFormData] = useState({ dd_option: '' });
  const [bankFormData, setBankFormData] = useState({ bank: '' });
  const [td_options, set_td_options] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankFormData({
      ...bankFormData,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/settings', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          set_td_options(data.td_options || []);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText || 'Unauthorized access'}`);
        }
      } catch (error) {
        console.error('Network or unexpected error:', error);
        setMessage(`Network or unexpected error: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBankOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/getBankOptions', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setBankOptions(data.bankOptions || []);
        } else {
          console.error('Error fetching bank options');
          setMessage('Error fetching bank options');
        }
      } catch (error) {
        console.error('Error fetching bank options:', error);
        setMessage('Error fetching bank options');
      }
    };

    fetchBankOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/settings', {
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

  const handleBankSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    
    try {
      const response = await fetch('http://localhost:3001/addBankOption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank: bankFormData.bank }), // Use the user input from the form state
      });
  
      const data = await response.json();
      console.log(data); // Log the response from the server
      // Optionally, handle the response, like resetting the form or displaying a success message
      if (response.ok) {
        setMessage('Bank option added successfully!');
        setBankFormData({ bank: '' }); // Reset the form
      } else {
        setMessage('Error adding bank option');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setMessage('Error submitting form');
    }
  };  

  return (
    <div className="main">
      <NavBar />
      <div>
        <form onSubmit={handleSubmit}>
          <div className="option">
            <label htmlFor="name">Enter Description Option:</label>
            <input
              type="text"
              name="dd_option"
              value={formData.dd_option}
              onChange={handleChange}
            />
          </div>
          <div className="submit">
            <input type="submit" />
          </div>
        </form>
      </div>
      <Dropdown title="Description Options" data={td_options} />
      <div>
        <form onSubmit={handleBankSubmit}>
          <div className="option">
            <label htmlFor="name">Enter Account Option:</label>
            <input
              type="text"
              name="bank"
              value={bankFormData.bank}
              onChange={handleBankChange}
            />
          </div>
          <div className="submit">
            <input type="submit" />
          </div>
        </form>
      </div>
      <Dropdown title="Bank Options" data={bankOptions} />
    </div>
  );
};

export default Settings;
